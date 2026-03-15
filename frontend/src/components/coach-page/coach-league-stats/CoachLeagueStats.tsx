import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/Heading';
import TableWrapper from '@/components/ui/TableWrapper';
import { useCoachLeagueStats } from '@/hooks/queries/coach/UseCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachStats } from '@/types/api/Coach';

import CoachFilterBar from '../shared/CoachFilterBar';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import styles from './CoachLeagueStats.module.css';
import { computeHasNeutral, computeLeagueStats, computeTotalStats } from './coach-league-stats.utils';
import { useCoachSeasonStatsTable } from '../coach-gamelog/season-stats/UseCoachSeasonStatsTable';

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

	const { table } = useCoachSeasonStatsTable(leagueStats, 'league');
	const { table: footTable } = useCoachSeasonStatsTable(totalStats, 'total');

	return (
		<section className={styles.section}>
			<Heading title="All Time Record" />
			<CoachFilterBar coachRole={coachRole} setCoachRole={setCoachRole} location={location} setLocation={setLocation} hasNeutral={hasNeutral} />

			<TableWrapper>
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
				<UniversalTableFooter table={footTable} variant="default" />
			</TableWrapper>
		</section>
	);
};

export default CoachLeagueStats;
