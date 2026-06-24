import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { InlineError } from '@/components/UI/inline-error/InlineError';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerSeasonAverage } from '@/hooks/queries/player/UsePlayerSeasonAverage';
import { usePlayerSeasonLeagueAverage } from '@/hooks/queries/player/UsePlayerSeasonLeagueAverage';
import { GameStatsEntry, SeasonLeagueEntry } from '@/types/api/Player';
import { usePlayerHasAppearances } from '@/utils/PlayerHasAppearances';

import { LeagueCell, playerLeagueStatsColumns } from '../../PlayerLeagueStats/columns';

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

	const groups = useMemo(
		() =>
			buildPhaseGroups<SeasonLeagueEntry, GameStatsEntry>(seasonLeagueAverage, {
				combined: (e) => e,
				regular: (e) => e.regular,
				playoff: (e) => e.playoff,
				split: (e) => e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <LeagueCell leagueSlug={r.league_slug} />,
			}),
		[seasonLeagueAverage]
	);

	const footerRows = useMemo<StatsDataRow<GameStatsEntry>[]>(
		() => (seasonAverage ?? []).map((data, i) => ({ key: `season-${i}`, data })),
		[seasonAverage]
	);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	if (seasonAverageError || seasonLeagueAverageError) {
		return <InlineError message="Failed to load season averages." />;
	}

	return (
		<StatsTable
			columns={playerLeagueStatsColumns}
			groups={groups}
			footer={{ rows: footerRows, variant: 'gradient' }}
		/>
	);
};

export default SeasonAverage;
