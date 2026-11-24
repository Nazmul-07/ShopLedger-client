/**
 * Format an ISO date string into a readable date (e.g. "Nov 25, 2026").
 */
export function formatDate(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

/**
 * Format an ISO date string into a readable date & time (e.g. "Nov 25, 2026, 2:23 AM").
 */
export function formatDateTime(dateInput?: string | Date | null): string {
  if (!dateInput) return "—";
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

/**
 * Convert an ISO date string (or current date) into YYYY-MM-DD for HTML <input type="date">.
 */
export function toDateInputValue(dateInput?: string | Date | null): string {
  const date = dateInput
    ? typeof dateInput === "string"
      ? new Date(dateInput)
      : dateInput
    : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Convert a YYYY-MM-DD string from <input type="date"> to an ISO string.
 */
export function fromDateInputValue(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const parsed = new Date(`${dateStr}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString();
}
