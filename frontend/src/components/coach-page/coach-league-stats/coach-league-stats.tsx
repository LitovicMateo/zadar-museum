import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import TableWrapper from '@/components/ui/table-wrapper';
import { useCoachLeagueStats } from '@/hooks/queries/coach/useCoachLeagueStats';
import { useCoachRecord } from '@/hooks/queries/coach/useCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';
import { CoachStatsResponse, CoachStats } from '@/types/api/coach';

import { useCoachSeasonStatsTable } from '../coach-gamelog/useCoachSeasonStatsTable';
import CoachRoleFilter from './coach-role-filter';
import LocationFilter from './location-filter';

const CoachLeagueStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const [coachRole, setCoachRole] = useState<'total' | 'allTime' | 'headCoach' | 'assistantCoach'>('total');
	const [location, setLocation] = useState<'total' | 'home' | 'away'>('total');

	const { data: coachLeagueStats } = useCoachLeagueStats(coachId!, db!);
	const { data: coachRecord } = useCoachRecord(coachId!, db);

	const leagueStats: CoachStats[] = useMemo(() => {
		if (!coachLeagueStats) return [];

		return coachLeagueStats.map((row: CoachStatsResponse) => {
			// coachLeagueStats uses 'total' while coachRecord uses 'allTime'. Map 'allTime' to 'total' for league rows.
			const keyForRow = coachRole === 'allTime' ? 'total' : coachRole;
			return (row as any)[keyForRow]?.[location];
		});
	}, [coachLeagueStats, coachRole, location]);

	const totalStats: CoachStats[] = useMemo(() => {
		if (!coachRecord) return [];

		// coachRecord uses 'allTime' key for overall stats; map 'total' to 'allTime' when indexing the record
		const keyForRecord = coachRole === 'total' ? 'allTime' : coachRole;
		return [(coachRecord as any)[keyForRecord]?.[location]];
	}, [coachRecord, coachRole, location]);

	const { TableHead, TableBody } = useCoachSeasonStatsTable(leagueStats, 'league');
	const { TableFoot } = useCoachSeasonStatsTable(totalStats, 'total');

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All Time Record" />
			<div className="flex flex-row gap-8 font-abel">
				<CoachRoleFilter coachRole={coachRole} setCoachRole={setCoachRole} />
				<LocationFilter location={location} setLocation={setLocation} />
			</div>

			<TableWrapper>
				<TableHead />
				<TableBody />
				<TableFoot />
			</TableWrapper>
		</section>
	);
};

export default CoachLeagueStats;
