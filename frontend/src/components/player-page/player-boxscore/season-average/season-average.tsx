import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerSeasonAverage } from '@/hooks/queries/player/usePlayerSeasonAverage';
import { usePlayerSeasonLeagueAverage } from '@/hooks/queries/player/usePlayerSeasonLeagueAverage';
import { usePlayerLeagueStatsTable } from '@/hooks/usePlayerLeagueStatsTable';
import { usePlayerHasAppearances } from '@/utils/playerHasAppearances';

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

	const { TableHead, TableBody } = usePlayerLeagueStatsTable(seasonLeagueAverage);
	const { TableFooter } = usePlayerLeagueStatsTable(seasonAverage ?? []);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (seasonAverageError || seasonLeagueAverageError) {
		return <p>Something went wrong</p>;
	}

	return (
		<TableWrapper>
			<TableHead />
			<TableBody />
			<TableFooter />
		</TableWrapper>
	);
};

export default SeasonAverage;
