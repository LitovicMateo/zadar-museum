import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { useGameScore } from '@/hooks/queries/game/useGameScore';

import GameInfo from './game-info';

const GameHeader: React.FC = () => {
	const { gameId } = useParams();

	// fetch game details
	const { data: game, isLoading } = useGameDetails(gameId!);

	const { data: score } = useGameScore(gameId!);

	if (!game || isLoading) return null;

	return (
		<section className=" max-h-[250px] h-fit bg-gradient-to-br from-blue-800 to-blue-900 text-blue-50 w-full">
			<div className="grid grid-cols-[2fr_1fr_2fr] grid-rows-[1fr_fit-content] gap-4 pt-4 h-full max-w-[800px] mx-auto text-2xl ">
				<div className="flex justify-center items-center whitespace-nowrap text-ellipsis">
					<Link to={APP_ROUTES.team(game.home_team.slug)}>
						<p className="md:hidden hover:!text-white">{game.home_team_short_name}</p>
						<p className="hidden md:block hover:!text-white">{game.home_team_name}</p>
					</Link>
				</div>
				<div className="flex justify-center items-center ">
					<span>{score?.home_score ?? '-'}</span>
					<span className="mx-2">:</span>
					<span>{score?.away_score ?? '-'}</span>
				</div>
				<div className="flex justify-center items-center">
					<Link to={APP_ROUTES.team(game.away_team.slug)}>
						<p className="md:hidden hover:!text-white">{game.away_team_short_name}</p>
						<p className="hidden md:block hover:!text-white">{game.away_team_name}</p>
					</Link>
				</div>
				<GameInfo />
			</div>
		</section>
	);
};

export default GameHeader;
