import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import Radio from '@/components/UI/Radio/Radio';
import RadioGroup from '@/components/UI/RadioGroup/RadioGroup';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { useIsMobile } from '@/hooks/UseMobile';
import { useCoachLeagueStats } from '@/hooks/queries/coach/UseCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats } from '@/types/api/Coach';

import { useCoachSeasonStatsTable } from '../CoachSeasonStats/UseCoachSeasonStatsTable';
import { computeHasNeutral, computeLeagueStats, computeTotalStats } from './CoachLeagueStats.utils';

import styles from './CoachLeagueStats.module.css';

const CoachLeagueStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const [coachRole, setCoachRole] = useState<'total' | 'headCoach' | 'assistantCoach'>('total');
	const [location, setLocation] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const isMobile = useIsMobile();

	const { data: coachLeagueStats } = useCoachLeagueStats(coachId!, db!);
	const { data: coachRecord } = useCoachRecord(coachId!, db);

	const hasNeutral = useMemo(() => computeHasNeutral(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);

	useEffect(() => {
		if (!hasNeutral && location === 'neutral') setLocation('total');
	}, [hasNeutral, location]);

	const leagueStats: CoachStats[] = useMemo(
		() => computeLeagueStats(coachLeagueStats, coachRole, location),
		[coachLeagueStats, coachRole, location]
	);

	const totalStats: CoachStats[] = useMemo(
		() => computeTotalStats(coachRecord, coachRole, location),
		[coachRecord, coachRole, location]
	);

	const { table } = useCoachSeasonStatsTable(leagueStats, 'league');
	const { table: footTable } = useCoachSeasonStatsTable(totalStats, 'total');

	const coachRoleOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [{ value: 'total', label: 'Total' }];
		if (coachRecord?.headCoach?.['total']?.games) opts.push({ value: 'headCoach', label: 'Head Coach' });
		if (coachRecord?.assistantCoach?.['total']?.games)
			opts.push({ value: 'assistantCoach', label: 'Assistant Coach' });
		return opts;
	}, [coachRecord]);

	const locationOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [
			{ value: 'total', label: 'Total' },
			{ value: 'home', label: 'Home' },
			{ value: 'away', label: 'Away' }
		];
		if (hasNeutral) opts.push({ value: 'neutral', label: 'Neutral' });
		return opts;
	}, [hasNeutral]);

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
							<Radio label="Home" onChange={() => setLocation('home')} isActive={location === 'home'} />
							<Radio label="Away" onChange={() => setLocation('away')} isActive={location === 'away'} />
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
				<TableWrapper>
					<UniversalTableHead table={table} />
					<UniversalTableBody table={table} />
					<UniversalTableFooter table={footTable} variant="default" />
				</TableWrapper>
			</section>
		</section>
	);
};

export default CoachLeagueStats;
