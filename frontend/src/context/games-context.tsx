// context/GamesContext.tsx
import React, { createContext, useState, useEffect, useMemo, useCallback, JSX } from 'react';
import { useParams } from 'react-router-dom';

import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { useTeamSeasonCompetitions } from '@/hooks/queries/team/useTeamSeasonCompetitions';
import { useTeamSeasons } from '@/hooks/queries/team/useTeamSeasons';
import { useSeasonSchedule } from '@/hooks/queries/useSeasonSchedule';
import { useSearch } from '@/hooks/useSearch';
import { TeamCompetitionsResponse, TeamScheduleResponse } from '@/types/api/team';
import { searchGames } from '@/utils/search-functions';
import Cookies from 'js-cookie';

type GamesContextType = {
	seasons: string[] | undefined;
	selectedSeason: string;
	setSelectedSeason: (s: string) => void;
	competitions: TeamCompetitionsResponse[] | undefined;
	selectedCompetitions: string[];
	toggleCompetition: (slug: string) => void;
	searchTerm: string;
	schedule: TeamScheduleResponse[] | undefined;
	filteredSchedule: TeamScheduleResponse[] | undefined;
	scheduleLoading: boolean;
	teamSlug: string;
	teamName: string;
	isZadar: boolean;
	SearchInput: JSX.Element;
};

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const filterSchedule = (
	schedule: TeamScheduleResponse[],
	selectedCompetitions: string[],
	searchTerm: string,
	isZadar: boolean
): TeamScheduleResponse[] => {
	if (!schedule || schedule.length === 0) return [];

	const compSet = new Set(selectedCompetitions);
	return schedule.filter((game) => {
		if (!compSet.has(game.league_id)) return false;
		if (isZadar && searchTerm) return searchGames(game, searchTerm);
		return true;
	});
};

export const GamesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// cookies
	const initialSeason = Cookies.get('season') || '';
	const initialCompetitions = Cookies.get('competitions') ? JSON.parse(Cookies.get('competitions')!) : [];

	// params
	const { teamSlug: paramSlug } = useParams();
	const { SearchInput, searchTerm } = useSearch();

	// derive effective slug + name
	const effectiveSlug = paramSlug || 'kk-zadar';
	const { data: team } = useTeamDetails(effectiveSlug);
	const effectiveName = team?.name || 'KK Zadar';
	const isZadar = effectiveName === 'KK Zadar';

	// state
	const [selectedSeason, setSelectedSeason] = useState(initialSeason);
	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(initialCompetitions);

	// queries
	const { data: seasons } = useTeamSeasons(effectiveSlug);
	const { data: competitions } = useTeamSeasonCompetitions(effectiveSlug, selectedSeason);
	const { data: schedule, isLoading: scheduleLoading } = useSeasonSchedule(selectedSeason, effectiveSlug);

	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons, setSelectedSeason]);

	// persist cookies
	useEffect(() => {
		Cookies.set('season', selectedSeason, { expires: 30 });
	}, [selectedSeason]);

	useEffect(() => {
		Cookies.set('competitions', JSON.stringify(selectedCompetitions), { expires: 30 });
	}, [selectedCompetitions]);

	// when season changes -> reset competitions
	useEffect(() => {
		if (competitions && competitions.length > 0) {
			const uniqueLeagueIds = Array.from(new Set(competitions.map((c) => c.league_id)));
			setSelectedCompetitions(uniqueLeagueIds);
		}
	}, [competitions, selectedSeason]);

	// handlers
	const toggleCompetition = useCallback((slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	}, [setSelectedCompetitions]);

	// use top-level `filterSchedule` helper (defined above)

	const filteredSchedule = useMemo(() => {
		if (!schedule) return [];
		if (process.env.NODE_ENV === 'development') console.time('filteredSchedule');
		const result = filterSchedule(schedule, selectedCompetitions, searchTerm, isZadar);
		if (process.env.NODE_ENV === 'development') console.timeEnd('filteredSchedule');
		return result;
	}, [schedule, selectedCompetitions, searchTerm, isZadar]);

	const providerValue = useMemo(
		() => ({
			seasons,
			selectedSeason,
			setSelectedSeason,
			competitions,
			selectedCompetitions,
			toggleCompetition,
			searchTerm,
			SearchInput,
			schedule,
			filteredSchedule,
			scheduleLoading,
			teamSlug: effectiveSlug,
			teamName: effectiveName,
			isZadar
		}),
		[
			seasons,
			selectedSeason,
			setSelectedSeason,
			competitions,
			selectedCompetitions,
			toggleCompetition,
			searchTerm,
			SearchInput,
			schedule,
			filteredSchedule,
			scheduleLoading,
			effectiveSlug,
			effectiveName,
			isZadar
		]
	);

	return <GamesContext.Provider value={providerValue}>{children}</GamesContext.Provider>;
};

export default GamesContext;
