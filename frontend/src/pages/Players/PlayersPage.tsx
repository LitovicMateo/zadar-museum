import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import { APP_ROUTES } from '@/constants/routes';
import { usePlayers } from '@/hooks/queries/player/usePlayers';
import { useSearch } from '@/hooks/useSearch';
import { searchPlayers } from '@/utils/search-functions';

const PlayersPage: React.FC = () => {
	const { data: players } = usePlayers('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search players...' });

	if (!players) return null;

	if (players && players.length === 0) return <NoContent>No players in database.</NoContent>;
	const filteredPlayers = searchPlayers(players, searchTerm);

	return (
		<div>
			<div className="max-w-[200px]">{SearchInput}</div>
			<ul>
				{filteredPlayers.map((player) => (
					<li key={player.id}>
						<Link to={APP_ROUTES.player(player.documentId)}>
							{player.first_name} {player.last_name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default PlayersPage;
