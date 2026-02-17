/** Format a number in Pakistani-style: lakhs and crores */
export function formatPKR(value: number): string {
  if (value === 0) return "Rs. 0";
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_00_00_000) {
    return `${sign}Rs. ${(abs / 1_00_00_000).toFixed(2)} Cr`;
  }
  if (abs >= 1_00_000) {
    return `${sign}Rs. ${(abs / 1_00_000).toFixed(2)} Lakh`;
  }
  if (abs >= 1_000) {
    return `${sign}Rs. ${(abs / 1_000).toFixed(2)}K`;
  }
  return `${sign}Rs. ${abs.toLocaleString("en-PK")}`;
}

/** Format large numbers concisely (for chart axes, market cap, etc.) */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (abs >= 1_000_000_000) {
    return `${sign}${(abs / 1_000_000_000).toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${(abs / 1_000).toFixed(1)}K`;
  }
  return `${sign}${abs.toFixed(0)}`;
}

/** Format a number as percentage with sign */
export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

/** Format market cap from thousands */
export function formatMarketCap(thousands: number | null): string {
  if (thousands == null) return "N/A";
  const value = thousands * 1000;
  return formatPKR(value);
}
