// hooks/useBoxscore.ts
import { useContext } from 'react';

import BoxscoreContext from '@/context/player-gamelog-context';

export const useBoxscore = () => {
	const ctx = useContext(BoxscoreContext);
	if (!ctx) throw new Error('useBoxscore must be used within a BoxscoreProvider');
	return ctx;
};
