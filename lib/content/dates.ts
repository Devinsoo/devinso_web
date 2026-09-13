/**
 * The UI formats dates by appending a time of its own (`${date}T00:00:00`), so
 * a value must arrive as a plain `YYYY-MM-DD` — which is what the bundled
 * content has always held. The API returns full timestamps, and handing one
 * over unchanged produces `Invalid time value` and a 500.
 */
export function toDateOnly(iso: string | undefined | null): string {
  if (!iso) return "";

  // Already date-only: leave it alone rather than round-tripping through Date,
  // which would shift it by the viewer's timezone.
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;

  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return "";

  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");

  return `${parsed.getFullYear()}-${month}-${day}`;
}
