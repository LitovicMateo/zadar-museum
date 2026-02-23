import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useCoachRecord } from '@/hooks/queries/coach/useCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';

import Heading from '../../ui/heading';
import RadioButtons from './radio-buttons/radio-buttons';
import { useCoachAllTimeStatsTable, CoachAllTimeStatsTableHead, CoachAllTimeStatsTableBody } from './useCoachAllTimeStatsTable';
import styles from './coach-all-time-stats.module.css';

export type View = 'total' | 'headCoach' | 'assistantCoach';

const CoachAllTimeStats: React.FC = () => {
	const [view, setView] = React.useState<View>('total');
	const { coachId } = useParams();

	const { db } = useCoachProfileDatabase(coachId!);
	const { data: coachRecord } = useCoachRecord(coachId!, db);
	const data = React.useMemo(() => coachRecord?.[view] || [], [coachRecord, view]);
	const { table } = useCoachAllTimeStatsTable(data);

	return (
		<section className={styles.section}>
			<Heading title="All-time stats" />
			<RadioButtons view={view} setView={setView} />
			<TableWrapper>
				<CoachAllTimeStatsTableHead table={table} />
				<CoachAllTimeStatsTableBody table={table} />
			</TableWrapper>
		</section>
	);
};

export default CoachAllTimeStats;
