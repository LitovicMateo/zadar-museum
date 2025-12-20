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

	const idRole = React.useId();
	const idLocation = React.useId();
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

	// create table
	const { TableHead, TableBody } = useCoachSeasonStatsTable(leagueStats, 'league');
	const { TableFoot } = useCoachSeasonStatsTable(totalStats, 'total');

	return (
		<div className="flex flex-col gap-4">
			{/* radio groups */}
			<div className="flex flex-row gap-8 font-abel">
				<div>
					<p className="font-semibold mb-1">Coach Role</p>
					<fieldset aria-label="Coach role" className="flex flex-row gap-4 font-abel">
						<legend className="sr-only">Coach role</legend>
						<label htmlFor={`${idRole}-total`} className="flex gap-2">
							<input
								id={`${idRole}-total`}
								type="radio"
								name={`coach-role-${idRole}`}
								value="total"
								checked={coachRole === 'total'}
								onChange={() => setCoachRole('total')}
							/>
							Total
						</label>
						<label htmlFor={`${idRole}-head`} className="flex gap-2">
							<input
								id={`${idRole}-head`}
								type="radio"
								name={`coach-role-${idRole}`}
								value="headCoach"
								checked={coachRole === 'headCoach'}
								onChange={() => setCoachRole('headCoach')}
							/>
							Head
						</label>
						<label htmlFor={`${idRole}-assist`} className="flex gap-2">
							<input
								id={`${idRole}-assist`}
								type="radio"
								name={`coach-role-${idRole}`}
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
					<fieldset aria-label="Location" className="flex flex-row gap-4 font-abel">
						<legend className="sr-only">Location</legend>
						<label htmlFor={`${idLocation}-total`} className="flex gap-2">
							<input
								id={`${idLocation}-total`}
								type="radio"
								name={`location-${idLocation}`}
								value="total"
								checked={location === 'total'}
								onChange={() => setLocation('total')}
							/>
							Total
						</label>
						<label htmlFor={`${idLocation}-home`} className="flex gap-2">
							<input
								id={`${idLocation}-home`}
								type="radio"
								name={`location-${idLocation}`}
								value="home"
								checked={location === 'home'}
								onChange={() => setLocation('home')}
							/>
							Home
						</label>
						<label htmlFor={`${idLocation}-away`} className="flex gap-2">
							<input
								id={`${idLocation}-away`}
								type="radio"
								name={`location-${idLocation}`}
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
