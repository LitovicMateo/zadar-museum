import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useSeasonLeagueStats } from '@/hooks/queries/coach/useSeasonLeagueStats';
import { useSeasonTotalStats } from '@/hooks/queries/coach/useSeasonTotalStats';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';
import { CoachStatsResponse, CoachStats } from '@/types/api/coach';

import { useCoachSeasonStatsTable } from './useCoachSeasonStatsTable';

type CoachSeasonStatsProps = {
	season: string;
};

const CoachSeasonStats: React.FC<CoachSeasonStatsProps> = ({ season }) => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);

	const { data: coachLeagueStats } = useSeasonLeagueStats(coachId!, season, db!);
	const { data: coachTotalStats } = useSeasonTotalStats(coachId!, season, db!);

	// radio group state
	const [coachRole, setCoachRole] = useState<'total' | 'headCoach' | 'assistantCoach'>('total');
	const [location, setLocation] = useState<'total' | 'home' | 'away'>('total');

	const leagueStats: CoachStats[] = useMemo(() => {
		if (!coachLeagueStats) return [];

		return coachLeagueStats.map((row: CoachStatsResponse) => {
			return row[coachRole]?.[location];
		});
	}, [coachLeagueStats, coachRole, location]);

	const totalStats: CoachStats[] = useMemo(() => {
		if (!coachTotalStats) return [];

		return [coachTotalStats![coachRole]?.[location]];
	}, [coachTotalStats, coachRole, location]);

	console.log('LEAGUE STATS', leagueStats);
	console.log('TOTAL STATS', totalStats);

	// create table
	const { TableHead, TableBody } = useCoachSeasonStatsTable(leagueStats);
	const { TableFoot } = useCoachSeasonStatsTable(totalStats);

	return (
		<div className="flex flex-col gap-4">
			{/* radio groups */}
			<div className="flex flex-row gap-8 font-abel">
				<div>
					<p className="font-semibold mb-1">Coach Role</p>
					<fieldset className="flex flex-row gap-4 font-abel">
						<label className="flex gap-2">
							<input
								type="radio"
								value="total"
								checked={coachRole === 'total'}
								onChange={() => setCoachRole('total')}
							/>
							Total
						</label>
						<label className="flex gap-2">
							<input
								type="radio"
								value="headCoach"
								checked={coachRole === 'headCoach'}
								onChange={() => setCoachRole('headCoach')}
							/>
							Head
						</label>
						<label className="flex gap-2">
							<input
								type="radio"
								value="assistantCoach"
								checked={coachRole === 'assistantCoach'}
								onChange={() => setCoachRole('assistantCoach')}
							/>
							Assistant
						</label>
					</fieldset>
				</div>

				<div>
					<p className="font-semibold mb-1">Location</p>
					<fieldset className="flex flex-row gap-4 font-abel">
						<label className="flex gap-2">
							<input
								type="radio"
								value="total"
								checked={location === 'total'}
								onChange={() => setLocation('total')}
							/>
							Total
						</label>
						<label className="flex gap-2">
							<input
								type="radio"
								value="home"
								checked={location === 'home'}
								onChange={() => setLocation('home')}
							/>
							Home
						</label>
						<label className="flex gap-2">
							<input
								type="radio"
								value="away"
								checked={location === 'away'}
								onChange={() => setLocation('away')}
							/>
							Away
						</label>
					</fieldset>
				</div>
			</div>

			<TableWrapper>
				<TableHead />
				<TableBody />
				<TableFoot />
			</TableWrapper>
		</div>
	);
};

export default CoachSeasonStats;
