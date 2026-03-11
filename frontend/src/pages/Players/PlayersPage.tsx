import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import { APP_ROUTES } from '@/constants/Routes';
import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { useSearch } from '@/hooks/UseSearch';
import { searchPlayers } from '@/utils/SearchFunctions';
import styles from '@/pages/Players/PlayersPage.module.css';

const PlayersPage: React.FC = () => {
	const { data: players } = usePlayers('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search players...' });

	if (!players) return null;

	if (players && players.length === 0) return <NoContent type="info" description="No players in database." />;
	const filteredPlayers = searchPlayers(players, searchTerm);

	return (
		<div>
			<div className={styles.searchWrap}>{SearchInput}</div>
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
