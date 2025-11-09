import { useContext } from 'react';

import GamesContext from '@/context/games-context';

export const useGamesContext = () => {
	const ctx = useContext(GamesContext);
	if (!ctx) throw new Error('useGamesContext must be used within GamesProvider');
	return ctx;
};
