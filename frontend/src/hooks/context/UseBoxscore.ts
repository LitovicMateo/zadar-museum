// hooks/useBoxscore.ts
import { useContext } from 'react';

import BoxscoreContext from '@/context/PlayerGamelogContext';

export const useBoxscore = () => {
	const ctx = useContext(BoxscoreContext);
	if (!ctx) throw new Error('useBoxscore must be used within a BoxscoreProvider');
	return ctx;
};
