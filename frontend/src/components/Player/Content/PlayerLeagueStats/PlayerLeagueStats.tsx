import React from 'react';
import { useParams } from 'react-router-dom';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/UseAllTimeLeagueStats';
import { usePlayerHasAppearances } from '@/utils/PlayerHasAppearances';

import MainTable from './main-table/MainTable';
import PlayerLeagueRecords from './PlayerLeagueRecords';

type View = 'total' | 'average';
type Location = 'total' | 'home' | 'away' | 'neutral';

const PlayerLeagueStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const [view, setView] = React.useState<View>('total');
	const [location, setLocation] = React.useState<Location>('total');

	const { data: leagueData } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const hasHome = !!leagueData?.some((d) => (d.total?.home?.games ?? 0) > 0);
	const hasAway = !!leagueData?.some((d) => (d.total?.away?.games ?? 0) > 0);
	const hasNeutral = !!leagueData?.some((d) => (d.total?.neutral?.games ?? 0) > 0);

	React.useEffect(() => {
		if (location === 'home' && !hasHome) setLocation('total');
		else if (location === 'away' && !hasAway) setLocation('total');
		else if (location === 'neutral' && !hasNeutral) setLocation('total');
	}, [hasHome, hasAway, hasNeutral, location]);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	const viewOptions: SegmentedOption<View>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'average', label: 'Average' }
	];

	const locations: SegmentedOption<Location>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home', disabled: !hasHome },
		{ value: 'away', label: 'Away', disabled: !hasAway },
		{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
	];

	return (
		<section className="space-y-4">
			<MobileFilterSheet title="Filter stats">
				<div className="flex flex-wrap items-center gap-3">
					<SegmentedToggle
						value={view}
						onValueChange={setView}
						options={viewOptions}
						ariaLabel="Total or average"
						itemClassName="border border-court data-[state=on]:border-transparent"
					/>
					<SegmentedToggle
						value={location}
						onValueChange={setLocation}
						options={locations}
						ariaLabel="Location filter"
						itemClassName="border border-court data-[state=on]:border-transparent"
					/>
				</div>
			</MobileFilterSheet>

			<MainTable view={view} location={location} />

			<PlayerLeagueRecords />
		</section>
	);
});

PlayerLeagueStats.displayName = 'PlayerLeagueStats';

export default PlayerLeagueStats;
