import React, { useState } from 'react';

import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';

import LeagueCoachRankings from '../LeagueCoachRankings/LeagueCoachRankings';
import LeaguePlayerRankings from '../LeaguePlayerRankings/LeaguePlayerRankings';

type RankingsView = 'players' | 'coaches';

const VIEW_OPTIONS: { value: RankingsView; label: string }[] = [
	{ value: 'players', label: 'Players' },
	{ value: 'coaches', label: 'Coaches' }
];

const LeagueRankings: React.FC = () => {
	const [view, setView] = useState<RankingsView>('players');

	return (
		<div className="space-y-4">
			<SegmentedToggle<RankingsView>
				value={view}
				onValueChange={setView}
				options={VIEW_OPTIONS}
				ariaLabel="Player or coach rankings"
				itemClassName="border border-court data-[state=on]:border-transparent"
			/>
			{view === 'players' ? <LeaguePlayerRankings /> : <LeagueCoachRankings />}
		</div>
	);
};

export default LeagueRankings;
