import React from 'react';
import { Link } from 'react-router-dom';

import TeamLogo from '@/components/Schedule/TeamLogo';
import { APP_ROUTES } from '@/constants/Routes';
import { cn } from '@/lib/Utils';
import { Stat } from '@/types/api/Player';
import { StrapiImage } from '@/types/api/Strapi';

type CareerHighRowProps = {
	label: string;
	stat: Stat;
	image?: StrapiImage;
	featured?: boolean;
};

const CareerHighRow: React.FC<CareerHighRowProps> = ({ label, stat, image, featured }) => {
	return (
		<Link
			to={APP_ROUTES.game(stat.game_id)}
			className={cn(
				'group relative flex flex-col gap-2 overflow-hidden rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
				featured && 'sm:col-span-2'
			)}
		>
			<span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-record" />
			<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
				{label}
			</span>
			<span
				className={cn(
					'font-display font-black leading-none tabular-nums text-foreground',
					featured ? 'text-5xl sm:text-6xl' : 'text-4xl'
				)}
			>
				{stat.stat_value}
			</span>
			<span className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground">
				<TeamLogo image={image} name={stat.opponent_team_name} className="h-5 w-5 shrink-0" />
				<span className="truncate">vs {stat.opponent_team_name}</span>
				<span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-border" />
				<span className="shrink-0">{stat.game_date}</span>
			</span>
		</Link>
	);
};

export default CareerHighRow;
