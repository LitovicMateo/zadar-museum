import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useRefereeSeasonLeagueStats } from '@/hooks/queries/referee/useRefereeSeasonLeagueStats';
import { useRefereeSeasonStats } from '@/hooks/queries/referee/useRefereeSeasonStats';

import { useRefereeStatsTable } from './useRefereeStatsTable';

type RefereeSeasonStatsProps = {
	season: string;
};

const RefereeSeasonStats: React.FC<RefereeSeasonStatsProps> = ({ season }) => {
	const { refereeId } = useParams();

	const { data: seasonStats } = useRefereeSeasonStats(refereeId, season);
	const { data: seasonLeagueStats } = useRefereeSeasonLeagueStats(refereeId, season);

	const leagueStats = useMemo(() => {
		if (!seasonLeagueStats) return [];
		return seasonLeagueStats.map((league) => league.stats.total);
	}, [seasonLeagueStats]);

	const { TableHead, TableBody } = useRefereeStatsTable(leagueStats);
	const { TableFoot } = useRefereeStatsTable(seasonStats);

	if (!seasonStats || seasonStats.length === 0) return null;

	return (
		<>
			<Heading title="Season Stats" type="secondary" />

			<TableWrapper>
				<TableHead />
				<TableBody />
				<TableFoot />
			</TableWrapper>
		</>
	);
};

export default RefereeSeasonStats;
