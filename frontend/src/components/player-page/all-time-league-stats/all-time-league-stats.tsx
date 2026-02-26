import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/useAllTimeLeagueStats';
import { usePlayerHasAppearances } from '@/utils/playerHasAppearances';

import Buttons from './buttons/buttons';
import MainTable from './main-table/main-table';

const AllTimeLeagueStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const [view, setView] = React.useState<'total' | 'average'>('total');
	const [location, setLocation] = React.useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const handleViewChange = (view: 'total' | 'average') => {
		setView(view);
	};

	const { data: leagueData } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const hasNeutral = !!(leagueData?.some((d) => (d.total?.neutral?.games ?? 0) > 0));

	React.useEffect(() => {
		if (!hasNeutral && location === 'neutral') setLocation('total');
	}, [hasNeutral, location]);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	return (
		<section className="flex flex-col gap-4" aria-labelledby="league-stats-heading">
			<Heading title="All Time League Stats" id="league-stats-heading" />
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-8">
				<Buttons selected={view} setSelected={handleViewChange} />
				<fieldset className="flex flex-row gap-4 font-abel">
					{(['total', 'home', 'away', 'neutral'] as const).map((loc) => (
						<label
							key={loc}
							className={`flex items-center gap-2 transition-colors duration-200 ${loc === 'neutral' && !hasNeutral ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-blue-600'}`}
						>
							<input
								type="radio"
								name="league-stats-location"
								value={loc}
								checked={location === loc}
								onChange={() => setLocation(loc)}
								disabled={loc === 'neutral' && !hasNeutral}
								className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed"
							/>
							<span className="text-sm font-medium capitalize">{loc}</span>
						</label>
					))}
				</fieldset>
			</div>
			<MainTable view={view} location={location} />
		</section>
	);
});

AllTimeLeagueStats.displayName = 'AllTimeLeagueStats';

export default AllTimeLeagueStats;
