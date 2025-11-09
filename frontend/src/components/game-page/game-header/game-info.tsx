import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { Calendar1, MapPin, Trophy, Users } from 'lucide-react';

const GameInfo: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game || isLoading) return null;

	const date = new Date(game.date).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });

	return (
		<div className=" h-full px-4 py-2 col-span-3 border-t border-solid border-gray-50 grid grid-cols-2 justify-center md:flex gap-2 md:justify-between items-center text-xs uppercase font-mono">
			<div className="flex gap-2 justify-center">
				<Trophy size={14} />
				<Link to={APP_ROUTES.league(game.competition.slug)}>
					<span>
						{game.league_name}, {game.round + '. kolo'}
					</span>
				</Link>
			</div>
			<div className="flex gap-2 justify-center">
				<MapPin size={14} />
				<Link to={APP_ROUTES.venue(game.venue.slug)}>
					<span>
						{game.venue.name}, {game.venue.city}
					</span>
				</Link>
			</div>
			<div className="flex gap-2 justify-center">
				<Calendar1 size={14} />
				<span>{date}</span>
			</div>
			<div className="flex gap-2 justify-center">
				<Users size={14} />
				<span>{game.attendance}</span>
			</div>
		</div>
	);
};

export default GameInfo;
