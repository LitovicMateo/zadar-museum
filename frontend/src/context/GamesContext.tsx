import { ALL_COMPETITIONS, filterSchedule } from './GamesUtils';
import React, { createContext, useState, useTransition, useCallback, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { useTeamSeasonCompetitions } from '@/hooks/queries/team/UseTeamSeasonCompetitions';
import { useTeamSeasons } from '@/hooks/queries/team/UseTeamSeasons';
import { useSeasonSchedule } from '@/hooks/queries/UseSeasonSchedule';
import { TeamCompetitionsResponse, TeamScheduleResponse } from '@/types/api/Team';
import Cookies from 'js-cookie';

type GamesContextType = {
	seasons: string[] | undefined;
	selectedSeason: string;
	setSelectedSeason: (s: string) => void;
	isPending: boolean;
	competitions: TeamCompetitionsResponse[] | undefined;
	selectedCompetition: string;
	setSelectedCompetition: (v: string) => void;
	searchTerm: string;
	setSearchTerm: (v: string) => void;
	schedule: TeamScheduleResponse[] | undefined;
	filteredSchedule: TeamScheduleResponse[] | undefined;
	scheduleLoading: boolean;
	teamSlug: string;
	teamName: string;
	isMainTeam: boolean;
};

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	// cookies
	const initialSeason = Cookies.get('season') || '';

	// params
	const { teamSlug: paramSlug } = useParams();

	// derive effective slug + name
	const { data: mainTeam } = useMainTeam();
	const effectiveSlug = paramSlug || mainTeam?.slug || '';
	const { data: team } = useTeamDetails(effectiveSlug);
	const effectiveName = team?.name || mainTeam?.name || '';
	const isMainTeam = team?.isMainTeam ?? false;

	// state
	const [selectedSeason, setSelectedSeasonRaw] = useState(initialSeason);
	const [selectedCompetition, setSelectedCompetition] = useState<string>(ALL_COMPETITIONS);
	const [searchTerm, setSearchTerm] = useState('');
	const [isPending, startTransition] = useTransition();

	const setSelectedSeason = useCallback((s: string) => startTransition(() => setSelectedSeasonRaw(s)), []);

	// queries
	const { data: seasons } = useTeamSeasons(effectiveSlug);
	const { data: rawCompetitions } = useTeamSeasonCompetitions(effectiveSlug, selectedSeason);
	const { data: schedule, isLoading: scheduleLoading } = useSeasonSchedule(selectedSeason, effectiveSlug);

	// deduplicate competitions by league_id — API returns one row per game type (home/away/neutral)
	const competitions = useMemo<TeamCompetitionsResponse[] | undefined>(() => {
		if (!rawCompetitions) return undefined;
		const seen = new Set<string>();
		return rawCompetitions.filter((c) => {
			const id = String(c.league_id);
			if (seen.has(id)) return false;
			seen.add(id);
			return true;
		});
	}, [rawCompetitions]);

	// default to the most recent season
	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons, setSelectedSeason]);

	// persist season cookie
	useEffect(() => {
		Cookies.set('season', selectedSeason, { expires: 30 });
	}, [selectedSeason]);

	// reset competition filter to "all" whenever the season changes
	useEffect(() => {
		setSelectedCompetition(ALL_COMPETITIONS);
	}, [selectedSeason]);

	// derived schedule
	const filteredSchedule = useMemo(
		() => filterSchedule(schedule, selectedCompetition, searchTerm, effectiveSlug),
		[schedule, selectedCompetition, searchTerm, effectiveSlug]
	);

	return (
		<GamesContext.Provider
			value={{
				seasons,
				selectedSeason,
				setSelectedSeason,
				isPending,
				competitions,
				selectedCompetition,
				setSelectedCompetition,
				searchTerm,
				setSearchTerm,
				schedule,
				filteredSchedule,
				scheduleLoading,
				teamSlug: effectiveSlug,
				teamName: effectiveName,
				isMainTeam
			}}
		>
			{children}
		</GamesContext.Provider>
	);
};

export default GamesContext;
