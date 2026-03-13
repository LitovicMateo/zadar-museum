import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PlayerHeader from '@/components/Player/PlayerHeader/PlayerHeader';
import ProfilePageWrapper from '@/components/ui/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { BoxscoreProvider } from '@/context/PlayerGamelogContext';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';

import PlayerContent from './PlayerContent';
import { PlayerErrorBoundary } from './PlayerErrorBoundary';

import styles from './Player.module.css';

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
				{/* <ProfilePageWrapper
					header={
						<PlayerErrorBoundary>
							<PlayerHeader />
						</PlayerErrorBoundary>
					}
					content={
						<main id="player-content" tabIndex={-1} className={styles.playerMain}>
							<PlayerErrorBoundary>
								<PlayerContent />
							</PlayerErrorBoundary>
						</main>
					}
				/> */}
			</BoxscoreProvider>
		</>
	);
};

export default Player;
