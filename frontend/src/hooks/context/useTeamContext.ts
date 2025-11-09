import { useContext } from 'react';

import TeamGamesContext from '@/context/team-context';

export const useTeamGamesContext = () => {
	const context = useContext(TeamGamesContext);
	if (!context) throw new Error('useTeamGamesContext must be used within a TeamGamesProvider');
	return context;
};
