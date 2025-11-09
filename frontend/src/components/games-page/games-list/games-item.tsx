import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';

type GamesListItemProps = {
	game: TeamScheduleResponse;
};

const GamesListItem: React.FC<GamesListItemProps> = ({ game }) => {
	const url = APP_ROUTES.game(game.game_document_id.toString());

	const date = `${game.game_date}`.split('T')[0].split('-').reverse().join('/');

	return (
		<>
			<div>{date}</div>
			<div>{game.round}</div>
			<div>
				<Link to={url}>
					{game.home_team_name} vs {game.away_team_name}
				</Link>
			</div>
			<div>
				{game.home_score} - {game.away_score}
			</div>
		</>
	);
};

export default GamesListItem;
