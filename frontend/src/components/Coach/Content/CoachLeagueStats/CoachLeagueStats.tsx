import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useCoachLeagueStats } from '@/hooks/queries/coach/UseCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats, CoachStatsResponse } from '@/types/api/Coach';

import { computeHasAway, computeHasHome, computeHasNeutral } from './CoachLeagueStats.utils';
import { CoachLeagueCell, coachStatsColumns } from '../coachColumns';

type Role = 'total' | 'headCoach' | 'assistantCoach';
type Loc = 'total' | 'home' | 'away' | 'neutral';

const CoachLeagueStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const [coachRole, setCoachRole] = useState<Role>('total');
	const [location, setLocation] = useState<Loc>('total');

	const { data: coachLeagueStats } = useCoachLeagueStats(coachId!, db!);
	const { data: coachRecord } = useCoachRecord(coachId!, db);

	const hasHome = useMemo(() => computeHasHome(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);
	const hasAway = useMemo(() => computeHasAway(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);
	const hasNeutral = useMemo(() => computeHasNeutral(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);

	useEffect(() => {
		if (location === 'home' && !hasHome) setLocation('total');
		else if (location === 'away' && !hasAway) setLocation('total');
		else if (location === 'neutral' && !hasNeutral) setLocation('total');
	}, [hasHome, hasAway, hasNeutral, location]);

	const groups = useMemo(
		() =>
			buildPhaseGroups<CoachStatsResponse, CoachStats>(coachLeagueStats, {
				combined: (e) => e[coachRole][location],
				regular: (e) => e.regular?.[coachRole]?.[location] ?? null,
				playoff: (e) => e.playoff?.[coachRole]?.[location] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <CoachLeagueCell leagueSlug={r.league_slug} />,
			}),
		[coachLeagueStats, coachRole, location]
	);

	const footerRows = useMemo<StatsDataRow<CoachStats>[]>(() => {
		const row = coachRecord?.[coachRole]?.[location];
		return row && row.games ? [{ key: 'total', data: { ...row, league_id: null, league_slug: null } }] : [];
	}, [coachRecord, coachRole, location]);

	const roleOptions = useMemo<SegmentedOption<Role>[]>(
		() => [
			{ value: 'total', label: 'Total' },
			{ value: 'headCoach', label: 'Head', disabled: !coachRecord?.headCoach?.total?.games },
			{ value: 'assistantCoach', label: 'Assistant', disabled: !coachRecord?.assistantCoach?.total?.games }
		],
		[coachRecord]
	);

	const locationOptions = useMemo<SegmentedOption<Loc>[]>(
		() => [
			{ value: 'total', label: 'Total' },
			{ value: 'home', label: 'Home', disabled: !hasHome },
			{ value: 'away', label: 'Away', disabled: !hasAway },
			{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
		],
		[hasHome, hasAway, hasNeutral]
	);

	return (
		<section className="space-y-4">
			<MobileFilterSheet title="Filter league stats">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
					<SegmentedToggle
						value={coachRole}
						onValueChange={setCoachRole}
						options={roleOptions}
						ariaLabel="Coach role filter"
						itemClassName="border border-court data-[state=on]:border-transparent"
					/>
					<SegmentedToggle
						value={location}
						onValueChange={setLocation}
						options={locationOptions}
						ariaLabel="Location filter"
						itemClassName="border border-court data-[state=on]:border-transparent"
					/>
				</div>
			</MobileFilterSheet>
			<StatsTable
				columns={coachStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'default' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default CoachLeagueStats;
