import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/table-wrapper';
import { useLeagueTeamRecord } from '@/hooks/queries/league/useLeagueTeamRecord';

import { useLeagueAllTimeTable } from './useLeagueAllTimeTable';

const LeagueAllTime: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueRecord } = useLeagueTeamRecord(leagueSlug!);

	// All rows except the last (Home / Away) go into the body.
	const bodyStats = useMemo(
		() => leagueRecord?.stats.slice(0, -1) ?? [],
		[leagueRecord]
	);
	// The last row is the Total aggregate — rendered as a footer.
	const footStats = useMemo(
		() => leagueRecord?.stats.slice(-1) ?? [],
		[leagueRecord]
	);

	const { table } = useLeagueAllTimeTable(bodyStats);
	const { table: footTable } = useLeagueAllTimeTable(footStats);

	if (leagueRecord === undefined) return null;

	return (
		<section className={`flex flex-col gap-4`}>
			<Heading title="All Time Record" />
			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="light" />
			</TableWrapper>
		</section>
	);
};

export default LeagueAllTime;
