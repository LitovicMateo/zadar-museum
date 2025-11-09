import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { usePlayers } from '@/hooks/queries/player/usePlayers';
import { PlayerResponse } from '@/types/api/player';
import { getImageUrl } from '@/utils/getImageUrl';

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
							<Link to={APP_ROUTES.player(player.documentId)} className="flex h-16 justify-center gap-2 ">
								{imageUrl && (
									<img
										src={imageUrl}
										alt=""
										className=" aspect-square object-cover h-full  rounded-full"
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
