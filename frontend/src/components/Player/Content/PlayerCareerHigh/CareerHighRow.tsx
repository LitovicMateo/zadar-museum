import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { Stat } from '@/types/api/Player';

type CareerHighRowProps = {
	label: string;
	stat: Stat;
};

const CareerHighRow: React.FC<CareerHighRowProps> = ({ label, stat }) => {
	const { data: team } = useTeamDetails(stat.opponent_team_slug!);

	return (
		<Link
			to={APP_ROUTES.game(stat.game_id)}
			className="group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
		>
			<span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-record" />
			<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
				{label}
			</span>
			<span className="font-display text-4xl font-black leading-none tabular-nums text-foreground">
				{stat.stat_value}
			</span>
			<span className="flex items-center gap-1.5 text-xs text-muted-foreground">
				<span className="truncate">vs {team?.short_name ?? '—'}</span>
				<span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-border" />
				<span className="shrink-0">{stat.game_date}</span>
			</span>
		</Link>
	);
};

export default CareerHighRow;
