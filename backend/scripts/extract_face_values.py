"""
One-shot extractor for the PSX "Face Value" PDF.

PSX publishes a sector-wise PDF listing every listed equity with its symbol,
company name, face value (par value), fiscal year-end, outstanding shares, and
share registrar. We only need symbol + name + face_value for the dividend
math. Output a JSON keyed by symbol.

Run when PSX publishes an updated PDF:
    python backend/scripts/extract_face_values.py \\
        --pdf "face value.pdf" \\
        --out backend/face_values.json
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import pdfplumber


# Each data row looks like:
#   AGTL Al-Ghazi Tractors Limited 5 Dec 57,964,201 FAMCO Associates (Pvt.) Limited
#   PELPS Pak Elektron(Pref) 10 Jun 44,957,592
# Pattern:
#   <symbol>  <name (any chars, lazy)>  <face_value>  <3-letter month>  <shares with commas>  [optional registrar]
_ROW_RE = re.compile(
    r"^(?P<symbol>[A-Z][A-Z0-9]{1,15})"
    r"\s+(?P<name>.+?)"
    r"\s+(?P<face_value>\d{1,3})"
    r"\s+(?P<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)"
    r"\s+(?P<shares>[\d,]+)"
    r"(?:\s+.*)?$"
)

# Lines we explicitly ignore
_HEADER_FRAGMENTS = {
    "Symbol Company Name",
    "Face Year",
    "Value End",
    "O.S. Shares Registrar",
    "(Number of companies",
}


def _is_skip_line(line: str) -> bool:
    if not line.strip():
        return True
    for frag in _HEADER_FRAGMENTS:
        if frag in line:
            return True
    return False


def extract(pdf_path: Path) -> dict[str, dict[str, object]]:
    """Walk every page and parse data rows. Returns {symbol: {name, face_value}}."""
    out: dict[str, dict[str, object]] = {}
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text() or ""
            for raw in text.split("\n"):
                line = raw.strip()
                if _is_skip_line(line):
                    continue
                m = _ROW_RE.match(line)
                if not m:
                    continue
                symbol = m.group("symbol").upper()
                name = m.group("name").strip()
                try:
                    face_value = int(m.group("face_value"))
                except ValueError:
                    continue
                # Sanity: face values on PSX are 1, 2, 5, 10, 50, 100. Anything else is a parse error.
                if face_value not in (1, 2, 5, 10, 25, 50, 100):
                    continue
                if symbol in out:
                    # Duplicates can appear if a sector heading bleeds — first wins
                    continue
                out[symbol] = {"name": name, "face_value": face_value}
    return out


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--pdf", required=True, type=Path, help="Source PDF from PSX")
    ap.add_argument("--out", required=True, type=Path, help="Destination JSON file")
    args = ap.parse_args()

    if not args.pdf.exists():
        print(f"PDF not found: {args.pdf}", file=sys.stderr)
        return 1

    rows = extract(args.pdf)
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(rows, indent=2, ensure_ascii=False), encoding="utf-8")

    # Quick summary so you can sanity-check the output
    by_fv: dict[int, int] = {}
    for entry in rows.values():
        by_fv[entry["face_value"]] = by_fv.get(entry["face_value"], 0) + 1
    print(f"Wrote {len(rows)} symbols -> {args.out}")
    for fv, count in sorted(by_fv.items()):
        print(f"  Face value Rs. {fv}: {count} stocks")
    return 0


if __name__ == "__main__":
    sys.exit(main())
