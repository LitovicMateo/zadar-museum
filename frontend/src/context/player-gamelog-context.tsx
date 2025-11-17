// context/BoxscoreContext.tsx
import React, { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { usePlayerCompetitions } from '@/hooks/queries/player/usePlayerCompetitions';
import { usePlayerProfileDatabase } from '@/hooks/queries/player/usePlayerProfileDatabase';
import { usePlayerSeasons } from '@/hooks/queries/player/usePlayerSeasons';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerCompetitionResponse } from '@/types/api/player';

type BoxscoreContextType = {
	season: string;
	setSeason: (season: string) => void;
	selectedCompetitions: string[];
	playerId: string;
	toggleCompetition: (slug: string) => void;
	competitions: PlayerCompetitionResponse[];
	selectedDatabase: PlayerDB;
	toggleDatabase: (db: PlayerDB) => void;
};

const BoxscoreContext = createContext<BoxscoreContextType | undefined>(undefined);

export const BoxscoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { playerId } = useParams();
	const [season, setSeason] = useState('');
	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
	const [selectedDatabase, setSelectedDatabase] = useState<PlayerDB>('zadar');

	const { db } = usePlayerProfileDatabase(playerId!);
	const { data: competitions = [] } = usePlayerCompetitions(playerId!, season);
	const { data: seasons } = usePlayerSeasons(playerId!, selectedDatabase!);

	useEffect(() => {
		if (db) {
			setSelectedDatabase(db);
		}
	}, [db]);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSeason(seasons[0]);
		}
	}, [seasons]);

	useEffect(() => {
		if (competitions && competitions.length > 0) {
			setSelectedCompetitions(competitions.map((c) => c.league_id));
		}
	}, [competitions, season]);

	const toggleCompetition = (slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	};

	const toggleDatabase = (db: PlayerDB) => setSelectedDatabase(db);

	if (!playerId) return null;

	return (
		<BoxscoreContext.Provider
			value={{
				season,
				setSeason,
				selectedCompetitions,
				playerId,
				toggleCompetition,
				competitions,
				selectedDatabase,
				toggleDatabase
			}}
		>
			{children}
		</BoxscoreContext.Provider>
	);
};

export default BoxscoreContext;
