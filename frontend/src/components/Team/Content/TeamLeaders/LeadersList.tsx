import { TeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import LeadersRow from './LeadersRow';

type LeadersListProps = {
	teamLeaders: TeamLeaders[];
	stat: string | null;
	selected: 'player' | 'coach';
	startRank?: number;
};

export const leadersGrid = 'grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4';

const LeadersList = ({ teamLeaders, stat, selected, startRank = 1 }: LeadersListProps) => {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			<ul className="m-0 list-none p-0">
				{teamLeaders.map((leader, index) => (
					<LeadersRow key={leader.id} leader={leader} stat={stat!} selected={selected} rank={startRank + index} />
				))}
			</ul>
		</div>
	);
};

export default LeadersList;
