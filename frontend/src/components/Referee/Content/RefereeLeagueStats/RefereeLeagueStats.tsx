import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useRefereeLeagueStats } from '@/hooks/queries/referee/UseRefereeLeagueStats';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/UseRefereeTeamRecord';
import { RefereeLeagueStatsResponse, RefereeStats } from '@/types/api/Referee';

import { RefereeLeagueCell, refereeStatsColumns } from '../refereeColumns';

type Loc = 'total' | 'home' | 'away' | 'neutral';

const RefereeLeagueStats: React.FC = () => {
	const { refereeId } = useParams();
	const [selected, setSelected] = useState<Loc>('total');

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

	useEffect(() => {
		if (selected === 'home' && !hasHome) setSelected('total');
		else if (selected === 'away' && !hasAway) setSelected('total');
		else if (selected === 'neutral' && !hasNeutral) setSelected('total');
	}, [hasHome, hasAway, hasNeutral, selected]);

	const locationOptions = useMemo<SegmentedOption<Loc>[]>(
		() => [
			{ value: 'total', label: 'Total' },
			{ value: 'home', label: 'Home', disabled: !hasHome },
			{ value: 'away', label: 'Away', disabled: !hasAway },
			{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
		],
		[hasHome, hasAway, hasNeutral]
	);

	const groups = useMemo(
		() =>
			buildPhaseGroups<RefereeLeagueStatsResponse, RefereeStats>(leagueStats, {
				combined: (e) => e[selected],
				regular: (e) => e.regular?.[selected] ?? null,
				playoff: (e) => e.playoff?.[selected] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <RefereeLeagueCell leagueSlug={r.league_slug} />
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
		<section className="space-y-4">
			<MobileFilterSheet title="Filter league stats">
				<SegmentedToggle
					value={selected}
					onValueChange={setSelected}
					options={locationOptions}
					ariaLabel="Location filter"
				/>
			</MobileFilterSheet>
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
