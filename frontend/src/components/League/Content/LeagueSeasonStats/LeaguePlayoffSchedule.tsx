import React from 'react';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import { TeamScheduleResponse } from '@/types/api/Team';

type LeaguePlayoffScheduleProps = {
	/** Playoff-stage games for the competition + season (already filtered). */
	games: TeamScheduleResponse[];
};

const LeaguePlayoffSchedule: React.FC<LeaguePlayoffScheduleProps> = ({ games }) => (
	<section className="space-y-6">
		<h2 className="font-display text-lg font-semibold text-court">Playoffs</h2>
		<ScheduleList schedule={games} showCompetitionTitle={false} />
	</section>
);

export default LeaguePlayoffSchedule;
