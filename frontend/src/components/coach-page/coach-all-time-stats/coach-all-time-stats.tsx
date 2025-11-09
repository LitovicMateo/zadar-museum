import React from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useCoachRecord } from '@/hooks/queries/coach/useCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';

import Heading from '../../ui/heading';
import RadioButtons from './radio-buttons';
import { useCoachAllTimeStatsTable } from './useCoachAllTimeStatsTable';

export type View = 'allTime' | 'headCoach' | 'assistantCoach';

const CoachAllTimeStats: React.FC = () => {
	const [view, setView] = React.useState<View>('allTime');
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const { data: coachRecord } = useCoachRecord(coachId!, db);

	const data = React.useMemo(() => coachRecord?.[view] || [], [coachRecord, view]);

	const { TableBody, TableHead } = useCoachAllTimeStatsTable(data);

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All-time stats" />
			<RadioButtons view={view} setView={setView} />
			<TableWrapper>
				<TableHead />
				<TableBody />
			</TableWrapper>
		</section>
	);
};

export default CoachAllTimeStats;
