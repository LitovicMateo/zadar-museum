import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { Calendar1, MapPin, Trophy, Users } from 'lucide-react';
import getRoundLabel from './game-info.utils';

const GameInfo: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game || isLoading) return null;

	console.log(game);
	

	const date = new Date(game.date).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });

	return (
		<div className="px-4 py-4 md:py-5">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
				<Link
					to={APP_ROUTES.league(game.competition.slug)}
					className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors duration-200 group"
				>
					<div className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
						<Trophy size={16} className="text-blue-600" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-medium">Competition</span>
						<span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
							{game.league_name}
						</span>
						<span className="text-xs text-gray-600">{getRoundLabel(game.stage, game.round)}</span>
					</div>
				</Link>

				<Link
					to={APP_ROUTES.venue(game.venue.slug)}
					className="flex items-center gap-2 text-sm hover:text-blue-600 transition-colors duration-200 group"
				>
					<div className="flex items-center justify-center w-8 h-8 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
						<MapPin size={16} className="text-green-600" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-medium">Venue</span>
						<span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
							{game.venue.name}
						</span>
						<span className="text-xs text-gray-600">{game.venue.city}</span>
					</div>
				</Link>

				<div className="flex items-center gap-2 text-sm">
					<div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg">
						<Calendar1 size={16} className="text-purple-600" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-medium">Date</span>
						<span className="font-semibold text-gray-900">{date}</span>
					</div>
				</div>

				<div className="flex items-center gap-2 text-sm">
					<div className="flex items-center justify-center w-8 h-8 bg-orange-50 rounded-lg">
						<Users size={16} className="text-orange-600" />
					</div>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-medium">Attendance</span>
						<span className="font-semibold text-gray-900">{game.attendance}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default GameInfo;
