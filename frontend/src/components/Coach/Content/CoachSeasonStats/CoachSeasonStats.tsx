import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import Radio from '@/components/UI/Radio';
import RadioGroup from '@/components/UI/RadioGroup';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { useIsMobile } from '@/hooks/UseMobile';
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

import styles from './CoachSeasonStats.module.css';

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

	const isMobile = useIsMobile();

	// radio group state
	const [coachRole, setCoachRole] = useState<'total' | 'headCoach' | 'assistantCoach'>('total');
	const [location, setLocation] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

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
				combined: (e) => e[coachRole as Role][location as Loc],
				regular: (e) => e.regular?.[coachRole as Role]?.[location as Loc] ?? null,
				playoff: (e) => e.playoff?.[coachRole as Role]?.[location as Loc] ?? null,
				split: (e) => !!e.hasPhaseSplit,
				keyOf: (r) => r.league_slug ?? 'total',
				heading: (r) => <CoachLeagueCell leagueSlug={r.league_slug} />,
			}),
		[coachLeagueStats, coachRole, location]
	);

	const footerRows = useMemo<StatsDataRow<CoachStats>[]>(() => {
		const row = coachTotalStats?.[coachRole as Role]?.[location as Loc];
		return row && row.games ? [{ key: 'total', data: row }] : [];
	}, [coachTotalStats, coachRole, location]);

	const coachRoleOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [{ value: 'total', label: 'Total' }];
		if (coachTotalStats?.headCoach?.['total']?.games) opts.push({ value: 'headCoach', label: 'Head Coach' });
		if (coachTotalStats?.assistantCoach?.['total']?.games)
			opts.push({ value: 'assistantCoach', label: 'Assistant Coach' });
		return opts;
	}, [coachTotalStats]);

	const locationOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [{ value: 'total', label: 'Total' }];
		if (hasHome) opts.push({ value: 'home', label: 'Home' });
		if (hasAway) opts.push({ value: 'away', label: 'Away' });
		if (hasNeutral) opts.push({ value: 'neutral', label: 'Neutral' });
		return opts;
	}, [hasHome, hasAway, hasNeutral]);

	return (
		<div className={styles.section}>
			{/* radio groups */}
			<SeasonSelect
				seasons={seasons || []}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
				compact
			/>

			<div className={styles.filterBar}>
				{isMobile ? (
					<>
						<Select<OptionType>
							value={coachRoleOptions.find((o) => o.value === coachRole) ?? null}
							options={coachRoleOptions}
							onChange={(opt) => opt && setCoachRole(opt.value as typeof coachRole)}
							styles={selectStyle()}
							isSearchable={false}
							menuPortalTarget={document.body}
							menuPosition="fixed"
							menuPlacement="auto"
						/>
						<Select<OptionType>
							value={locationOptions.find((o) => o.value === location) ?? null}
							options={locationOptions}
							onChange={(opt) => opt && setLocation(opt.value as typeof location)}
							styles={selectStyle()}
							isSearchable={false}
							menuPortalTarget={document.body}
							menuPosition="fixed"
							menuPlacement="auto"
						/>
					</>
				) : (
					<>
						<RadioGroup>
							<Radio
								label="Total"
								onChange={() => setCoachRole('total')}
								isActive={coachRole === 'total'}
							/>
							<Radio
								label="Head Coach"
								isActive={coachRole === 'headCoach'}
								isDisabled={!coachTotalStats?.headCoach?.['total']?.games}
								onChange={() => setCoachRole('headCoach')}
							/>
							<Radio
								label="Assistant Coach"
								isActive={coachRole === 'assistantCoach'}
								isDisabled={!coachTotalStats?.assistantCoach?.['total']?.games}
								onChange={() => setCoachRole('assistantCoach')}
							/>
						</RadioGroup>
						<RadioGroup>
							<Radio
								label="Total"
								onChange={() => setLocation('total')}
								isActive={location === 'total'}
							/>
							<Radio
								label="Home"
								onChange={() => setLocation('home')}
								isActive={location === 'home'}
								isDisabled={!hasHome}
							/>
							<Radio
								label="Away"
								onChange={() => setLocation('away')}
								isActive={location === 'away'}
								isDisabled={!hasAway}
							/>
							<Radio
								label="Neutral"
								onChange={() => setLocation('neutral')}
								isActive={location === 'neutral'}
								isDisabled={!hasNeutral}
							/>
						</RadioGroup>
					</>
				)}
			</div>
			<div className={styles.content}>
				<StatsTable
					columns={coachStatsColumns}
					groups={groups}
					footer={{ rows: footerRows, variant: 'light' }}
					initialSort={{ columnId: 'games', dir: 'desc' }}
				/>
			</div>
		</div>
	);
};

export default CoachSeasonStats;
