import { useMemo } from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';

import { useMainTeam } from '../team/UseMainTeam';
import { usePlayerTeams } from './UsePlayerTeams';

export const usePlayerProfileDatabase = (playerId: string): { db: PlayerDB | null; enableSwitch: boolean } => {
	const { data: teams } = usePlayerTeams(playerId);
	const { data: mainTeam } = useMainTeam();

	return useMemo(() => {
		if (!teams || teams.length === 0 || !mainTeam) {
			return { db: null, enableSwitch: false }; // fallback if no teams / main team not loaded yet
		}

		const playedForMainTeam = teams.some((t) => t.team_slug === mainTeam.slug);
		const playedAgainstMainTeam = teams.some((t) => t.team_slug !== mainTeam.slug);

		if (playedForMainTeam && !playedAgainstMainTeam) {
			// Case 1: only the main team
			return { db: 'main', enableSwitch: false };
		}

		if (!playedForMainTeam && playedAgainstMainTeam) {
			// Case 2: only opponents
			return { db: 'opponent', enableSwitch: false };
		}

		if (playedForMainTeam && playedAgainstMainTeam) {
			// Case 3: both
			return { db: 'main', enableSwitch: true };
		}

		return { db: null, enableSwitch: false }; // fallback safety
	}, [teams, mainTeam]);
};
