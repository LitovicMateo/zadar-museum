import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/TableWrapper';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';

import Heading from '../../ui/Heading';
import RadioButtons from './radio-buttons/RadioButtons';
import { UniversalTableBody, UniversalTableHead } from '@/components/ui/table';
import { useCoachAllTimeStatsTable } from './UseCoachAllTimeStatsTable';
import styles from './CoachAllTimeStats.module.css';

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
				<UniversalTableHead table={table} />
				<UniversalTableBody table={table} />
			</TableWrapper>
		</section>
	);
};

export default CoachAllTimeStats;
