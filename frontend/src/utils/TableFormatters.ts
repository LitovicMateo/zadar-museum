/**
 * Shared formatting helpers used across TanStack table column definitions.
 */

/** Format a nullable percentage value. */
export const pct = (v: number | null): string => (v === null ? '—' : `${v}%`);

/** Format minutes:seconds from separate nullable values. */
export const mmss = (m: number | null, s: number | null): string => {
	if (m === null || s === null) return '—';
	const sec = String(s).padStart(2, '0');
	return `${m}:${sec}`;
};

/**
 * Format a made/attempted shooting line.
 * Returns '—' if made is null, uses '-' for attempted when data is missing.
 */
export const formatMakeAttempt = (made: number | null, attempted: number | null): string => {
	if (made === null || made === undefined) return '—';
	const madeNum = Number(made ?? 0);
	const attMissing =
		attempted === null || attempted === undefined || (Number(attempted) === 0 && madeNum > 0);
	const attDisplay = attMissing ? '-' : String(attempted);
	return `${made}/${attDisplay}`;
};
