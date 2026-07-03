import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { Calendar1, MapPin, Trophy, Users } from 'lucide-react';

import getRoundLabel from './game-info.utils';

type InfoCellProps = {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
	sub?: string;
	to?: string;
};

const InfoCell: React.FC<InfoCellProps> = ({ icon, label, value, sub, to }) => {
	const content = (
		<div className="flex items-start gap-2.5">
			<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-white/10 text-record">
				{icon}
			</span>
			<div className="flex min-w-0 flex-col">
				<span className="font-mono text-[10px] uppercase tracking-[0.12em] text-court-foreground/50">
					{label}
				</span>
				<span className="truncate text-sm font-semibold text-court-foreground">{value}</span>
				{sub && <span className="truncate text-xs text-court-foreground/60">{sub}</span>}
			</div>
		</div>
	);

	if (to) {
		return (
			<Link to={to} className="rounded-md transition-colors hover:bg-white/5">
				{content}
			</Link>
		);
	}
	return content;
};

const GameInfo: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game || isLoading) return null;

	const date = new Date(game.date).toLocaleString('default', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	});

	return (
		<div className="mx-auto grid w-full max-w-2xl grid-cols-2 justify-items-center gap-x-8 gap-y-4 border-t border-white/10 pt-5 sm:flex sm:max-w-none sm:flex-wrap sm:justify-center sm:gap-x-12">
			<InfoCell
				icon={<Trophy size={16} />}
				label="Competition"
				value={game.league_name}
				sub={getRoundLabel(game.stage, game.round, game.group_name)}
				to={APP_ROUTES.league(game.competition.slug)}
			/>
			<InfoCell
				icon={<MapPin size={16} />}
				label="Venue"
				value={game.venue.name}
				sub={game.venue.city}
				to={APP_ROUTES.venue(game.venue.slug)}
			/>
			<InfoCell icon={<Calendar1 size={16} />} label="Date" value={date} />
			<InfoCell icon={<Users size={16} />} label="Attendance" value={game.attendance} />
		</div>
	);
};

export default GameInfo;
