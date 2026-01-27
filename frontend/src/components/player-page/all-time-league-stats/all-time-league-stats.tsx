import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerHasAppearances } from '@/utils/playerHasAppearances';

import Buttons from './buttons/buttons';
import MainTable from './main-table/main-table';

const AllTimeLeagueStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const [view, setView] = React.useState<'total' | 'average'>('total');

	const handleViewChange = (view: 'total' | 'average') => {
		setView(view);
	};

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	return (
		<section className="flex flex-col gap-4" aria-labelledby="league-stats-heading">
			<Heading title="All Time League Stats" id="league-stats-heading" />
			<Buttons selected={view} setSelected={handleViewChange} />
			<MainTable view={view} />
		</section>
	);
});

AllTimeLeagueStats.displayName = 'AllTimeLeagueStats';

export default AllTimeLeagueStats;
