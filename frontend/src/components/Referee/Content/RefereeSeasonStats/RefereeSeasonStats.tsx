import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useRefereeSeasonLeagueStats } from '@/hooks/queries/referee/UseRefereeSeasonLeagueStats';
import { useRefereeSeasonStats } from '@/hooks/queries/referee/UseRefereeSeasonStats';
import { useRefereeSeasons } from '@/hooks/queries/referee/UseRefereeSeasons';
import { RefereSeasonStatsResponse, RefereeStats } from '@/types/api/Referee';

import { RefereeLeagueCell, refereeStatsColumns } from '../refereeColumns';

import styles from './RefereeSeasonStats.module.css';

const RefereeSeasonStats: React.FC = () => {
	const { refereeId } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const { data: seasons } = useRefereeSeasons(refereeId!);

	const { data: seasonStats } = useRefereeSeasonStats(refereeId, selectedSeason);
	const { data: seasonLeagueStats } = useRefereeSeasonLeagueStats(refereeId, selectedSeason);

	const groups = useMemo(
		() =>
			buildPhaseGroups<RefereSeasonStatsResponse, RefereeStats>(seasonLeagueStats, {
				combined: (e) => e.stats.total,
				regular: (e) => e.regular?.total ?? null,
				playoff: (e) => e.playoff?.total ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <RefereeLeagueCell leagueSlug={r.league_slug} />,
			}),
		[seasonLeagueStats]
	);

	const footerRows = useMemo<StatsDataRow<RefereeStats>[]>(
		() => (seasonStats ?? []).map((data, i) => ({ key: `season-${i}`, data })),
		[seasonStats]
	);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	if (!seasonStats || !seasons || seasonStats.length === 0) return null;

	return (
		<div className={styles.section}>
			<SeasonSelect
				seasons={seasons}
				selectedSeason={selectedSeason}
				compact
				onSeasonChange={setSelectedSeason}
			/>

			<StatsTable
				columns={refereeStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'light' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</div>
	);
};

export default RefereeSeasonStats;
