import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
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

		const { table } = useRefereeStatsTable(leagueStats);
        const { table: footTable } = useRefereeStatsTable(seasonStats);

	if (!seasonStats || seasonStats.length === 0) return null;

	return (
		<>
			<Heading title="Season Stats" type="secondary" />

			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</>
	);
};

export default RefereeSeasonStats;
