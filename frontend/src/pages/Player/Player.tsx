import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { BoxscoreProvider } from '@/context/PlayerGamelogContext';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';



export type PlayerDB = 'zadar' | 'opponent';

const Player: React.FC = () => {
	const { playerId } = useParams();
	const navigate = useNavigate();

	const { data: playerDetails, isFetched } = usePlayerDetails(playerId!);

	useEffect(() => {
		if (!playerDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [playerDetails, isFetched, navigate]);

	if (!playerDetails) return null;

	return (
		<>
			<BoxscoreProvider>
				{null}
			</BoxscoreProvider>
		</>
	);
};

export default Player;
