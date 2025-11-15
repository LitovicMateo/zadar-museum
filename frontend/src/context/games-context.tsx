// context/GamesContext.tsx
import React, { createContext, useState, useEffect, useMemo, JSX } from 'react';
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
	const toggleCompetition = (slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	};

	// derived schedule
	const filteredSchedule = useMemo(() => {
		if (!schedule) return [];

		return schedule.filter((game) => {
			const matchesCompetition = schedule.filter((g) => selectedCompetitions.includes(g.league_id));

			// if it's Zadar -> filter by search term
			if (isZadar) {
				const matchesSearch = searchGames(game, searchTerm);
				return matchesCompetition && matchesSearch;
			}

			return matchesCompetition;
		});
	}, [schedule, selectedCompetitions, searchTerm, isZadar]);

	return (
		<GamesContext.Provider
			value={{
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
			}}
		>
			{children}
		</GamesContext.Provider>
	);
};

export default GamesContext;
