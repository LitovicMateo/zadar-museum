import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableHead } from '@/components/UI/table';
import { useTeamStatsTable } from '@/hooks/UseTeamStatsTable';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { useGameTeamStats } from '@/hooks/queries/game/UseGameTeamStats';

const TeamStats: React.FC = () => {
	const { gameId } = useParams();

	const { data } = useGameTeamStats(gameId!);
	const { data: game } = useGameDetails(gameId!);

	const ordered = React.useMemo(() => {
		if (!data) return [];
		if (!game) return data;

		const home = data.find(
			(d) => d.team_document_id === game.home_team.documentId || d.team_slug === game.home_team.slug
		);
		const away = data.find(
			(d) => d.team_document_id === game.away_team.documentId || d.team_slug === game.away_team.slug
		);

		const others = data.filter((d) => d !== home && d !== away);

		const result = [] as typeof data;
		if (home) result.push(home);
		if (away) result.push(away);
		result.push(...others);

		return result;
	}, [data, game]);

	const { table } = useTeamStatsTable(ordered);

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
		</TableWrapper>
	);
};

export default TeamStats;
