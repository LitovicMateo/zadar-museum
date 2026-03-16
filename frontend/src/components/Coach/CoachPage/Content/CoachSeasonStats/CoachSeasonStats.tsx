import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import Radio from '@/components/ui/Radio';
import RadioGroup from '@/components/ui/RadioGroup';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { selectStyle, OptionType } from '@/constants/ReactSelectStyle';
import { useIsMobile } from '@/hooks/UseMobile';
import { useCoachSeasons } from '@/hooks/queries/coach/UseCoachSeasons';
import { useSeasonLeagueStats } from '@/hooks/queries/coach/UseSeasonLeagueStats';
import { useSeasonTotalStats } from '@/hooks/queries/coach/UseSeasonTotalStats';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats } from '@/types/api/Coach';

import { useCoachSeasonStatsTable } from './UseCoachSeasonStatsTable';
import { computeHasNeutralSeason, computeLeagueStatsSeason, computeTotalStatsSeason } from './coach-season-stats.utils';

import styles from './CoachSeasonStats.module.css';

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

	const hasNeutral = useMemo(
		() => computeHasNeutralSeason(coachLeagueStats, coachRole),
		[coachLeagueStats, coachRole]
	);

	useEffect(() => {
		if (!hasNeutral && location === 'neutral') setLocation('total');
	}, [hasNeutral, location]);

	const leagueStats: CoachStats[] = useMemo(
		() => computeLeagueStatsSeason(coachLeagueStats, coachRole, location),
		[coachLeagueStats, coachRole, location]
	);

	const totalStats: CoachStats[] = useMemo(
		() => computeTotalStatsSeason(coachTotalStats, coachRole, location),
		[coachTotalStats, coachRole, location]
	);

	// create table
	const { table } = useCoachSeasonStatsTable(leagueStats, 'league');
	const { table: footTable } = useCoachSeasonStatsTable(totalStats, 'total');

	const coachRoleOptions = useMemo<OptionType[]>(() => {
		const opts: OptionType[] = [{ value: 'total', label: 'Total' }];
		if (coachTotalStats?.headCoach?.['total']?.games) opts.push({ value: 'headCoach', label: 'Head Coach' });
		if (coachTotalStats?.assistantCoach?.['total']?.games)
			opts.push({ value: 'assistantCoach', label: 'Assistant Coach' });
		return opts;
	}, [coachTotalStats]);

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
			<div className={styles.content}>
				<TableWrapper>
					<UniversalTableHead table={table} />
					<UniversalTableBody table={table} />
					<UniversalTableFooter table={footTable} variant="light" />
				</TableWrapper>
			</div>
		</div>
	);
};

export default CoachSeasonStats;
