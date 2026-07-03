import { Link } from 'react-router-dom';

import { Avatar } from '@/components/UI/Avatar';
import { APP_ROUTES } from '@/constants/Routes';
import { cn } from '@/lib/Utils';
import { TeamLeaders } from '@/hooks/queries/team/UseTeamLeaders';

import { leadersGrid } from './LeadersList';

type LeadersRowProps = {
	leader: TeamLeaders;
	stat: string;
	selected: 'player' | 'coach';
	rank: number;
};

const LeadersRow = ({ leader, stat, selected, rank }: LeadersRowProps) => {
	const url = selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id);
	const isTop = rank === 1;

	return (
		<li className={cn(leadersGrid, 'border-t border-border py-2.5 transition-colors first:border-t-0 hover:bg-primary/5')}>
			<span className={cn('text-sm font-bold tabular-nums', isTop ? 'text-record' : 'text-muted-foreground')}>
				{rank}
			</span>
			<div className="flex min-w-0 items-center gap-2">
				<Avatar
					src={leader.image_url}
					alt={`${leader.first_name} ${leader.last_name}`}
					className="h-7 w-7 shrink-0"
				/>
				<Link to={url} className="min-w-0 truncate font-medium text-foreground transition-colors hover:text-primary">
					{leader.first_name} {leader.last_name}
				</Link>
			</div>
			<span className="text-right font-bold tabular-nums text-foreground">{leader[stat]}</span>
		</li>
	);
};

export default LeadersRow;
