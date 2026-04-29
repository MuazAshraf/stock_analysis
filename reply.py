"""
Reply to PSX Stock Analyzer feedback users from info@psxstocksanalyzer.com.

How to use:
  1. Add the people you want to email to RECIPIENTS below (name + email).
  2. Edit SUBJECT and the message in get_email_text() if needed.
  3. Run:  .venv/Scripts/python.exe reply.py
"""

import html as html_mod
import os
import smtplib
import time
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv

load_dotenv()

# ── Recipients: add the people you want to reply to here ──────────────────
RECIPIENTS = [
    {"name": "Amir", "email": "amirshani242@gmail.com"},
    # {"name": "Ali",     "email": "ali@example.com"},
    # {"name": "Sara",    "email": "sara@example.com"},
]

SUBJECT = "Your feedback is now live on PSX Stock Analyzer"


def get_email_text(name: str) -> str:
    """Plain-text body sent to each recipient. Edit freely."""
    return f"""Hi {name},

Thank you for your feedback on PSX Stock Analyzer.

You suggested an Intrinsic Value and Margin of Safety feature, and I'm happy to tell you it's now live on the site. You can paste any PSX company URL and instantly see:

  - The Graham Number (intrinsic value per share)
  - The current market price
  - The margin of safety as a percentage
  - A plain-English verdict — undervalued, fairly priced, or overvalued

Try it here: https://psxstocksanalyzer.com

I also wrote a short guide explaining how it works, in case you want to dig in:
https://psxstocksanalyzer.com/learn/intrinsic-value-margin-of-safety

If you have any other ideas or run into any bugs, just reply to this email — feedback like yours is what makes the tool better.

Thanks again,
PSX Stock Analyzer Team
https://psxstocksanalyzer.com
"""


def get_email_html(name: str, body_text: str) -> str:
    """Branded HTML version of the same message."""
    body = html_mod.escape(body_text).replace("\n\n", "</p><p>").replace("\n", "<br>")
    return f"""\
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#F8F3EA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8F3EA;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E5E0D9;">
        <tr>
          <td style="background-color:#404E3F;padding:24px 32px;">
            <span style="color:#4BC232;font-size:20px;font-weight:700;">PSX</span>
            <span style="color:#ffffff;font-size:20px;font-weight:700;"> Stock Analyzer</span>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;color:#404E3F;font-size:15px;line-height:1.7;">
            <p style="margin:0;">{body}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px 24px 32px;border-top:1px solid #E5E0D9;text-align:center;">
            <p style="color:#404E3F;font-size:12px;opacity:0.6;margin:0;">
              <a href="https://psxstocksanalyzer.com" style="color:#4BC232;text-decoration:none;font-weight:600;">psxstocksanalyzer.com</a>
              · Free Pakistan Stock Exchange analysis in plain English
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


# ── SMTP config (read from .env, no need to edit) ────────────────────────
SMTP_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("MAIL_PORT", "587"))
SMTP_USER = os.getenv("MAIL_USERNAME") or os.getenv("PSX_MAIL_USERNAME", "")
SMTP_PASS = os.getenv("MAIL_PASSWORD") or os.getenv("PSX_MAIL_PASSWORD", "")
FROM_ADDR = (
    os.getenv("MAIL_DEFAULT_SENDER")
    or os.getenv("PSX_MAIL_DEFAULT_SENDER")
    or SMTP_USER
)


def send_one(to_email: str, name: str) -> None:
    text_body = get_email_text(name)
    html_body = get_email_html(name, text_body)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = SUBJECT
    msg["From"] = f"PSX Stock Analyzer <{FROM_ADDR}>"
    msg["To"] = to_email
    msg["Reply-To"] = FROM_ADDR
    msg.attach(MIMEText(text_body, "plain", "utf-8"))
    msg.attach(MIMEText(html_body, "html", "utf-8"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)


if __name__ == "__main__":
    if not SMTP_USER or not SMTP_PASS:
        raise SystemExit("ERROR: MAIL_USERNAME / MAIL_PASSWORD missing from .env")

    print(f"Sending from {FROM_ADDR} to {len(RECIPIENTS)} recipient(s)...\n")
    for r in RECIPIENTS:
        try:
            send_one(r["email"], r["name"])
            print(f"  ✓ Sent to {r['email']}")
        except Exception as e:
            print(f"  ✗ Failed for {r['email']} — {type(e).__name__}: {e}")
        time.sleep(2)  # gentle pacing — Gmail allows ~500/day, no real rate limit
    print("\nDone!")
