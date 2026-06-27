import { useEffect, useMemo, useState } from 'react';

import { ALL_COMPETITIONS, filterSchedule } from '@/context/GamesUtils';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';
import { TeamCompetitionsResponse, TeamScheduleResponse } from '@/types/api/Team';

/** Owns season state and defaults to the most recent season (seasons are sorted newest-first). */
export const useSeasonState = (seasons: string[] | undefined) => {
	const [selectedSeason, setSelectedSeason] = useState('');

	useEffect(() => {
		if (seasons && seasons.length > 0) setSelectedSeason((cur) => cur || seasons[0]);
	}, [seasons]);

	return [selectedSeason, setSelectedSeason] as const;
};

/**
 * Standardised gamelog filtering for profile pages (coach/referee/venue/staff/league):
 * single-select competition + opponent search, plus the competitions available in the
 * selected season. `selectedSeason` is owned by the caller so it can also drive a
 * per-season fetch; client-side season filtering is a no-op when games are already scoped.
 */
export const useScheduleFilters = (
	gamelog: TeamScheduleResponse[] | undefined,
	selectedSeason: string
) => {
	const { data: mainTeam } = useMainTeam();

	const [selectedCompetition, setSelectedCompetition] = useState<string>(ALL_COMPETITIONS);
	const [searchTerm, setSearchTerm] = useState('');

	// reset competition filter when the season changes
	useEffect(() => {
		setSelectedCompetition(ALL_COMPETITIONS);
	}, [selectedSeason]);

	const seasonGames = useMemo(
		() => (selectedSeason ? (gamelog ?? []).filter((g) => g.season === selectedSeason) : gamelog ?? []),
		[gamelog, selectedSeason]
	);

	const competitions = useMemo<TeamCompetitionsResponse[]>(() => {
		const seen = new Set<string>();
		const list: TeamCompetitionsResponse[] = [];
		for (const g of seasonGames) {
			const id = String(g.league_id);
			if (seen.has(id)) continue;
			seen.add(id);
			list.push({
				league_id: g.league_id,
				league_name: g.league_name,
				league_slug: g.competition_slug,
				league_short_name: g.league_short_name ?? ''
			});
		}
		return list;
	}, [seasonGames]);

	const filteredGames = useMemo(
		() => filterSchedule(seasonGames, selectedCompetition, searchTerm, mainTeam?.slug),
		[seasonGames, selectedCompetition, searchTerm, mainTeam?.slug]
	);

	return {
		selectedCompetition,
		setSelectedCompetition,
		searchTerm,
		setSearchTerm,
		competitions,
		filteredGames
	};
};
