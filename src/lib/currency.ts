/**
 * Convert stored integer paisa to Taka (decimal).
 */
export function paisaToTaka(paisa: number): number {
  if (!Number.isFinite(paisa)) return 0;
  return paisa / 100;
}

/**
 * Convert user-entered Taka amount to integer paisa.
 * Uses Math.round to avoid IEEE-754 floating-point drift (e.g., 19.99 * 100).
 */
export function takaToPaisa(taka: number): number {
  if (!Number.isFinite(taka)) {
    throw new Error("Invalid monetary amount");
  }
  const paisa = Math.round(taka * 100);
  if (!Number.isSafeInteger(paisa)) {
    throw new Error("Monetary amount exceeds safe integer range");
  }
  return paisa;
}

/**
 * Format stored paisa amount as Bangladeshi Taka (e.g. "৳ 15,000.00").
 */
export function formatCurrency(paisa: number): string {
  const taka = paisaToTaka(paisa);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(taka));

  return taka < 0 ? `-৳ ${formatted}` : `৳ ${formatted}`;
}

/**
 * Format stored paisa amount in compact form for chart axes (e.g. "৳ 15K").
 */
export function formatCompactCurrency(paisa: number): string {
  const taka = paisaToTaka(paisa);
  const formatted = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.abs(taka));

  return taka < 0 ? `-৳ ${formatted}` : `৳ ${formatted}`;
}
