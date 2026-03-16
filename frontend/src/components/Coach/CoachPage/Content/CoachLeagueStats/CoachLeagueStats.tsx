import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Radio from '@/components/ui/Radio/Radio';
import RadioGroup from '@/components/ui/RadioGroup/RadioGroup';
import TableWrapper from '@/components/ui/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import { useCoachLeagueStats } from '@/hooks/queries/coach/UseCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats } from '@/types/api/Coach';

import { useCoachSeasonStatsTable } from '../../../../coach-page/coach-gamelog/season-stats/UseCoachSeasonStatsTable';
import { computeHasNeutral, computeLeagueStats, computeTotalStats } from './CoachLeagueStats.utils';

import styles from './CoachLeagueStats.module.css';

const CoachLeagueStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const [coachRole, setCoachRole] = useState<'total' | 'headCoach' | 'assistantCoach'>('total');
	const [location, setLocation] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

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

	return (
		<section className={styles.section}>
			<div className={styles.filterBar}>
				<RadioGroup>
					<Radio label="Total" onChange={() => setCoachRole('total')} isActive={coachRole === 'total'} />
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
					<Radio label="Total" onChange={() => setLocation('total')} isActive={location === 'total'} />
					<Radio label="Home" onChange={() => setLocation('home')} isActive={location === 'home'} />
					<Radio label="Away" onChange={() => setLocation('away')} isActive={location === 'away'} />
					<Radio
						label="Neutral"
						onChange={() => setLocation('neutral')}
						isActive={location === 'neutral'}
						isDisabled={!hasNeutral}
					/>
				</RadioGroup>
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
