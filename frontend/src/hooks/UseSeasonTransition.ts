import { useTransition } from 'react';

/**
 * Wraps any season-setter in React's `startTransition` so that switching
 * seasons is treated as a low-priority update. This keeps the current UI
 * interactive and painted while new-season queries are resolving, instead
 * of blocking the main thread until all consumers re-render.
 *
 * Usage:
 *   const { selectSeason, isPending } = useSeasonTransition(setSeason);
 *   <Select onChange={(opt) => selectSeason(opt?.value ?? '')} />
 *   <div style={{ opacity: isPending ? 0.6 : 1 }}>...</div>
 */
export function useSeasonTransition(setter: (season: string) => void) {
	const [isPending, startTransition] = useTransition();

	const selectSeason = (season: string) => {
		startTransition(() => {
			setter(season);
		});
	};

	return { selectSeason, isPending };
}
