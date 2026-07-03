import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { useCoachSeasons } from '@/hooks/queries/coach/UseCoachSeasons';
import { useSeasonLeagueStats } from '@/hooks/queries/coach/UseSeasonLeagueStats';
import { useSeasonTotalStats } from '@/hooks/queries/coach/UseSeasonTotalStats';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats, CoachStatsResponse } from '@/types/api/Coach';

import {
	computeHasAwaySeason,
	computeHasHomeSeason,
	computeHasNeutralSeason
} from './coach-season-stats.utils';
import { CoachLeagueCell, coachStatsColumns } from '../coachColumns';

type Role = 'total' | 'headCoach' | 'assistantCoach';
type Loc = 'total' | 'home' | 'away' | 'neutral';

const CoachSeasonStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);
	const [selectedSeason, setSelectedSeason] = useState('');

	const { data: seasons } = useCoachSeasons(coachId!);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons]);

	const { data: coachLeagueStats } = useSeasonLeagueStats(coachId!, selectedSeason, db!);
	const { data: coachTotalStats } = useSeasonTotalStats(coachId!, selectedSeason, db!);

	const [coachRole, setCoachRole] = useState<Role>('total');
	const [location, setLocation] = useState<Loc>('total');

	const hasHome = useMemo(() => computeHasHomeSeason(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);
	const hasAway = useMemo(() => computeHasAwaySeason(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);
	const hasNeutral = useMemo(
		() => computeHasNeutralSeason(coachLeagueStats, coachRole),
		[coachLeagueStats, coachRole]
	);

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
		const row = coachTotalStats?.[coachRole]?.[location];
		return row && row.games ? [{ key: 'total', data: row }] : [];
	}, [coachTotalStats, coachRole, location]);

	const roleOptions = useMemo<SegmentedOption<Role>[]>(
		() => [
			{ value: 'total', label: 'Total' },
			{ value: 'headCoach', label: 'Head', disabled: !coachTotalStats?.headCoach?.total?.games },
			{ value: 'assistantCoach', label: 'Assistant', disabled: !coachTotalStats?.assistantCoach?.total?.games }
		],
		[coachTotalStats]
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
			<MobileFilterSheet title="Filter season stats">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
					<SeasonSelect
						seasons={seasons || []}
						selectedSeason={selectedSeason}
						onSeasonChange={setSelectedSeason}
						compact
					/>
					<SegmentedToggle
						value={coachRole}
						onValueChange={setCoachRole}
						options={roleOptions}
						ariaLabel="Coach role filter"
					/>
					<SegmentedToggle
						value={location}
						onValueChange={setLocation}
						options={locationOptions}
						ariaLabel="Location filter"
					/>
				</div>
			</MobileFilterSheet>
			<StatsTable
				columns={coachStatsColumns}
				groups={groups}
				footer={{ rows: footerRows, variant: 'light' }}
				initialSort={{ columnId: 'games', dir: 'desc' }}
			/>
		</section>
	);
};

export default CoachSeasonStats;
