import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useLeagueTeamRecord } from '@/hooks/queries/league/useLeagueTeamRecord';

import { useLeagueAllTimeTable } from './useLeagueAllTimeTable';

const LeagueAllTime: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueRecord } = useLeagueTeamRecord(leagueSlug!);

	const { TableBody, TableHead } = useLeagueAllTimeTable(leagueRecord?.stats);

	if (leagueRecord === undefined) return null;

	return (
		<section className={`flex flex-col gap-4`}>
			<Heading title="All Time Record" />
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</section>
	);
};

export default LeagueAllTime;
