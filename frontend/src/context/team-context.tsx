import React, { createContext, useState, useEffect, ReactNode } from 'react';

import { useTeamSeasonCompetitions } from '@/hooks/queries/team/useTeamSeasonCompetitions';
import Cookies from 'js-cookie';

type TeamGamesContextType = {
	season: string;
	selectedCompetitions: string[];
	searchTerm: string;
	setSeason: (season: string) => void;
	handleCompetitionChange: (slug: string) => void;
	setSearchTerm: (term: string) => void;
};

const TeamGamesContext = createContext<TeamGamesContextType | undefined>(undefined);

type ProviderProps = {
	children: ReactNode;
	defaultSearchTerm?: string;
};

export const TeamGamesProvider: React.FC<ProviderProps> = ({ children, defaultSearchTerm = '' }) => {
	const initialSeason = Cookies.get('season') || '2025';
	const initialCompetitions = Cookies.get('competitions') ? JSON.parse(Cookies.get('competitions')!) : [];

	const [season, setSeason] = useState(initialSeason);
	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>(initialCompetitions);
	const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);

	const { data: competitions } = useTeamSeasonCompetitions('KK Zadar', season);

	// on season change refresh selected competitions
	useEffect(() => {
		const availableCompetitions = competitions?.map((c) => c.league_slug);
		setSelectedCompetitions(availableCompetitions ?? []);
	}, [competitions]);

	// Persist to cookies
	useEffect(() => {
		Cookies.set('season', season, { expires: 30 });
	}, [season]);

	useEffect(() => {
		Cookies.set('competitions', JSON.stringify(selectedCompetitions), { expires: 30 });
	}, [selectedCompetitions]);

	const handleCompetitionChange = (slug: string) => {
		if (selectedCompetitions.includes(slug)) {
			setSelectedCompetitions(selectedCompetitions.filter((s) => s !== slug));
		} else {
			setSelectedCompetitions([...selectedCompetitions, slug]);
		}
	};

	return (
		<TeamGamesContext.Provider
			value={{
				season,
				selectedCompetitions,
				searchTerm,
				setSeason,
				handleCompetitionChange,
				setSearchTerm
			}}
		>
			{children}
		</TeamGamesContext.Provider>
	);
};

export default TeamGamesContext;
