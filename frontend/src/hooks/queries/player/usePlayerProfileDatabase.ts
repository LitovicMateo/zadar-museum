import { useMemo } from 'react';

import { PlayerDB } from '@/pages/Player/Player';

import { usePlayerTeams } from './usePlayerTeams';

export const usePlayerProfileDatabase = (playerId: string): { db: PlayerDB | null; enableSwitch: boolean } => {
	const { data: teams } = usePlayerTeams(playerId);

	return useMemo(() => {
		if (!teams || teams.length === 0) {
			return { db: null, enableSwitch: false }; // fallback if no teams
		}

		const playedForZadar = teams.some((t) => t.team_slug === 'kk-zadar');
		const playedAgainstZadar = teams.some((t) => t.team_slug !== 'kk-zadar');

		if (playedForZadar && !playedAgainstZadar) {
			// Case 1: only Zadar
			return { db: 'zadar', enableSwitch: false };
		}

		if (!playedForZadar && playedAgainstZadar) {
			// Case 2: only opponents
			return { db: 'opponent', enableSwitch: false };
		}

		if (playedForZadar && playedAgainstZadar) {
			// Case 3: both
			return { db: 'zadar', enableSwitch: true };
		}

		return { db: null, enableSwitch: false }; // fallback safety
	}, [teams, playerId]);
};
