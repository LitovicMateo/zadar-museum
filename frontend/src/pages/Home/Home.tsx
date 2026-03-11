import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { PlayerResponse } from '@/types/api/Player';
import { getImageUrl } from '@/utils/GetImageUrl';
import styles from '@/pages/Home/Home.module.css';

const Home: React.FC = () => {
	const { data: players } = usePlayers('last_name', 'asc');

	return (
		<div>
			<h2>Home</h2>
			<ul>
				{players?.map((player: PlayerResponse) => {
					const imageUrl = player.image?.url && getImageUrl(player.image?.url);

					return (
						<li key={player.id}>
							<Link to={APP_ROUTES.player(player.documentId)} className={styles.item}>
								{imageUrl && (
									<img
										src={imageUrl}
										alt=""
										className={styles.img}
									/>
								)}
								<span>
									{player.first_name} {player.last_name}
								</span>
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default Home;
