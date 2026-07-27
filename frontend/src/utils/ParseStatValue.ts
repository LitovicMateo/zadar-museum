/**
 * Parse a form string into a number, leaving blank/whitespace-only input as null
 * (never fabricated as 0). Must be `null`, not `undefined` — `undefined` is dropped
 * by JSON.stringify, so on an update it would leave the existing DB value untouched
 * instead of clearing it; `null` survives and actually nulls the column.
 */
export const num = (v?: string): number | null => (v && v.trim() !== '' ? +v : null);
