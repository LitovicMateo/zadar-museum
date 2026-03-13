import React from 'react';
import { useParams } from 'react-router-dom';

import { InlineError } from '@/components/ui/inline-error/InlineError';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import TableWrapper from '@/components/ui/TableWrapper';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerSeasonAverage } from '@/hooks/queries/player/UsePlayerSeasonAverage';
import { usePlayerSeasonLeagueAverage } from '@/hooks/queries/player/UsePlayerSeasonLeagueAverage';
import { usePlayerLeagueStatsTable } from '@/hooks/UsePlayerLeagueStatsTable';
import { usePlayerHasAppearances } from '@/utils/PlayerHasAppearances';

const SeasonAverage: React.FC = () => {
	const { playerId } = useParams();
	const { season, selectedDatabase } = useBoxscore();

	const { data: seasonLeagueAverage, isError: seasonLeagueAverageError } = usePlayerSeasonLeagueAverage(
		playerId!,
		season,
		selectedDatabase
	);

	const { data: seasonAverage, isError: seasonAverageError } = usePlayerSeasonAverage(
		playerId!,
		season,
		selectedDatabase
	);

	const { table } = usePlayerLeagueStatsTable(seasonLeagueAverage);
	const { table: footTable } = usePlayerLeagueStatsTable(seasonAverage ?? []);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (seasonAverageError || seasonLeagueAverageError) {
		return <InlineError message="Failed to load season averages." />;
	}

	return (
		<TableWrapper>
			<UniversalTableHead table={table} />
			<UniversalTableBody table={table} />
			<UniversalTableFooter table={footTable} variant="gradient" />
		</TableWrapper>
	);
};

export default SeasonAverage;
