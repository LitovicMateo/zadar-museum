import React from 'react';
import { useParams } from 'react-router-dom';

import Pill from '@/components/UI/Pill';
import TableWrapper from '@/components/UI/TableWrapper';
import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/UI/table';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';

import { useCoachAllTimeStatsTable } from './UseCoachAllTimeStatsTable';

import styles from './CoachCareerStats.module.css';

export type View = 'total' | 'headCoach' | 'assistantCoach';

const ROW_ORDER = ['home', 'away', 'neutral'];

const CoachCareerStats: React.FC = () => {
	const [view, setView] = React.useState<View>('total');
	const { coachId } = useParams();

	const { db } = useCoachProfileDatabase(coachId!);
	const { data: coachRecord } = useCoachRecord(coachId!, db);
	const { bodyData, footerData } = React.useMemo(() => {
		const recordView = coachRecord?.[view];
		if (!recordView) return { bodyData: [], footerData: [] };

		const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
		const bodyData = ROW_ORDER.filter((key) => key in recordView).map((key) => ({
			name: capitalize(key),
			...recordView[key]
		}));
		const footerData = recordView['total'] ? [{ name: 'Total', ...recordView['total'] }] : [];

		return { bodyData, footerData };
	}, [coachRecord, view]);
	const { table, footerTable } = useCoachAllTimeStatsTable(bodyData, footerData);

	if (!coachRecord) {
		return <p>No career stats available.</p>;
	}

	return (
		<section className={styles.section}>
			<div className={styles.pillContainer}>
				<Pill label="total" isActive={view === 'total'} onClick={() => setView('total')} />
				<Pill
					label="headCoach"
					isActive={view === 'headCoach'}
					onClick={() => setView('headCoach')}
					isDisabled={!coachRecord?.headCoach?.['total']?.games}
				/>
				<Pill
					label="assistantCoach"
					isActive={view === 'assistantCoach'}
					onClick={() => setView('assistantCoach')}
					isDisabled={!coachRecord?.assistantCoach?.['total']?.games}
				/>
			</div>
			<div className={styles.content}>
				<TableWrapper>
					<UniversalTableHead table={table} />
					<UniversalTableBody table={table} />
					<UniversalTableFooter table={footerTable} />
				</TableWrapper>
			</div>
		</section>
	);
};

export default CoachCareerStats;
