import React from 'react';

import LeagueCoachRankings from '../LeagueCoachRankings/LeagueCoachRankings';
import LeaguePlayerRankings from '../LeaguePlayerRankings/LeaguePlayerRankings';

const LeagueRankings: React.FC = () => (
	<div className="space-y-10">
		<section>
			<h2 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
				Player Rankings
			</h2>
			<LeaguePlayerRankings />
		</section>
		<section>
			<h2 className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
				Coach Rankings
			</h2>
			<LeagueCoachRankings />
		</section>
	</div>
);

export default LeagueRankings;
