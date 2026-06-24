import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import DatabaseSelect from '@/components/Team/Content/TeamLeagueStats/DatabaseSelect';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useRefereeLeagueStats } from '@/hooks/queries/referee/UseRefereeLeagueStats';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/UseRefereeTeamRecord';
import { RefereeLeagueStatsResponse, RefereeStats } from '@/types/api/Referee';

import { RefereeLeagueCell, refereeStatsColumns } from '../refereeColumns';

import styles from './RefereeLeagueStats.module.css';

type Loc = 'total' | 'home' | 'away' | 'neutral';

const RefereeLeagueStats: React.FC = () => {
	const { refereeId } = useParams();
	const [selected, setSelected] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const { data: leagueStats } = useRefereeLeagueStats(refereeId);
	const { data: teamRecord } = useRefereeTeamRecord(refereeId!);

	const hasHome = useMemo(
		() => leagueStats?.some((row) => row.home !== null && (row.home?.games ?? 0) > 0) ?? false,
		[leagueStats]
	);
	const hasAway = useMemo(
		() => leagueStats?.some((row) => row.away !== null && (row.away?.games ?? 0) > 0) ?? false,
		[leagueStats]
	);
	const hasNeutral = useMemo(
		() => leagueStats?.some((row) => row.neutral !== null && (row.neutral?.games ?? 0) > 0) ?? false,
		[leagueStats]
	);

	const groups = useMemo(
		() =>
			buildPhaseGroups<RefereeLeagueStatsResponse, RefereeStats>(leagueStats, {
				combined: (e) => e[selected as Loc],
				regular: (e) => e.regular?.[selected as Loc] ?? null,
				playoff: (e) => e.playoff?.[selected as Loc] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <RefereeLeagueCell leagueSlug={r.league_slug} />,
			}),
		[leagueStats, selected]
	);

	const footerRows = useMemo<StatsDataRow<RefereeStats>[]>(() => {
		if (!teamRecord?.stats) return [];
		const selectedKey = selected.charAt(0).toUpperCase() + selected.slice(1);
		const match = teamRecord.stats.find((s) => s.key === selectedKey);
		return match ? [{ key: 'total', data: match }] : [];
	}, [teamRecord, selected]);

	if (!leagueStats || !teamRecord) return null;

	return (
		<section className={styles.section}>
			<DatabaseSelect
				selected={selected}
				setSelected={setSelected}
				homeDisabled={!hasHome}
				awayDisabled={!hasAway}
				neutralDisabled={!hasNeutral}
			/>
			<StatsTable
				columns={refereeStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'default' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default RefereeLeagueStats;
