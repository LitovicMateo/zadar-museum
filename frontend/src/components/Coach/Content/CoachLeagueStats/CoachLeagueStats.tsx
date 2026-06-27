import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import Radio from '@/components/UI/Radio/Radio';
import RadioGroup from '@/components/UI/RadioGroup/RadioGroup';
import { StatsTable, buildPhaseGroups, type StatsDataRow } from '@/components/UI/stats-table';
import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { useIsMobile } from '@/hooks/UseMobile';
import { useCoachLeagueStats } from '@/hooks/queries/coach/UseCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats, CoachStatsResponse } from '@/types/api/Coach';

import { computeHasAway, computeHasHome, computeHasNeutral } from './CoachLeagueStats.utils';
import { CoachLeagueCell, coachStatsColumns } from '../coachColumns';

import styles from './CoachLeagueStats.module.css';

type Role = 'total' | 'headCoach' | 'assistantCoach';
type Loc = 'total' | 'home' | 'away' | 'neutral';

const CoachLeagueStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const [coachRole, setCoachRole] = useState<'total' | 'headCoach' | 'assistantCoach'>('total');
	const [location, setLocation] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const isMobile = useIsMobile();

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
		const row = coachRecord?.[coachRole as Role]?.[location as Loc];
		return row && row.games ? [{ key: 'total', data: { ...row, league_id: null, league_slug: null } }] : [];
	}, [coachRecord, coachRole, location]);

	const coachRoleOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [{ value: 'total', label: 'Total' }];
		if (coachRecord?.headCoach?.['total']?.games) opts.push({ value: 'headCoach', label: 'Head Coach' });
		if (coachRecord?.assistantCoach?.['total']?.games)
			opts.push({ value: 'assistantCoach', label: 'Assistant Coach' });
		return opts;
	}, [coachRecord]);

	const locationOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [{ value: 'total', label: 'Total' }];
		if (hasHome) opts.push({ value: 'home', label: 'Home' });
		if (hasAway) opts.push({ value: 'away', label: 'Away' });
		if (hasNeutral) opts.push({ value: 'neutral', label: 'Neutral' });
		return opts;
	}, [hasHome, hasAway, hasNeutral]);

	return (
		<section className={styles.section}>
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
								isDisabled={!coachRecord?.headCoach?.['total']?.games}
								onChange={() => setCoachRole('headCoach')}
							/>
							<Radio
								label="Assistant Coach"
								isActive={coachRole === 'assistantCoach'}
								isDisabled={!coachRecord?.assistantCoach?.['total']?.games}
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
			<section className={styles.content}>
				<StatsTable
					columns={coachStatsColumns}
					groups={groups}
					footer={{ rows: footerRows, variant: 'default' }}
					initialSort={{ columnId: 'games', dir: 'desc' }}
				/>
			</section>
		</section>
	);
};

export default CoachLeagueStats;
