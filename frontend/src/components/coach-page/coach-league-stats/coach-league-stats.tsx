import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useCoachLeagueStats } from '@/hooks/queries/coach/useCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/useCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';
import { CoachStats } from '@/types/api/coach';

import CoachFilterBar from '../shared/CoachFilterBar';
import styles from './coach-league-stats.module.css';
import { computeHasNeutral, computeLeagueStats, computeTotalStats } from './coach-league-stats.utils';
import { useCoachSeasonStatsTable } from '../coach-gamelog/season-stats/useCoachSeasonStatsTable';

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

	const leagueStats: CoachStats[] = useMemo(() => computeLeagueStats(coachLeagueStats, coachRole, location), [coachLeagueStats, coachRole, location]);

	const totalStats: CoachStats[] = useMemo(() => computeTotalStats(coachRecord, coachRole, location), [coachRecord, coachRole, location]);

	const { TableHead, TableBody } = useCoachSeasonStatsTable(leagueStats, 'league');
	const { TableFoot } = useCoachSeasonStatsTable(totalStats, 'total');

	return (
		<section className={styles.section}>
			<Heading title="All Time Record" />
			<CoachFilterBar coachRole={coachRole} setCoachRole={setCoachRole} location={location} setLocation={setLocation} hasNeutral={hasNeutral} />

			<TableWrapper>
				<TableHead />
				<TableBody />
				<TableFoot />
			</TableWrapper>
		</section>
	);
};

export default CoachLeagueStats;
