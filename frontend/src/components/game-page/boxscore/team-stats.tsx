import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { useGameTeamStats } from '@/hooks/queries/game/useGameTeamStats';
import { useTeamStatsTable } from '@/hooks/useTeamStatsTable';

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

	const { TableBody, TableHead } = useTeamStatsTable(ordered);

	return (
		<div className="flex flex-col gap-2">
			<Heading title="Team Stats" />
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</div>
	);
};

export default TeamStats;
