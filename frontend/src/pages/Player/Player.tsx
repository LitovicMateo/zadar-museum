import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PlayerHeader from '@/components/player-page/player-header/player-header';
import { APP_ROUTES } from '@/constants/routes';
import { BoxscoreProvider } from '@/context/player-gamelog-context';
import { usePlayerDetails } from '@/hooks/queries/player/usePlayerDetails';

import PlayerContent from './PlayerContent';
import { PlayerErrorBoundary } from './PlayerErrorBoundary';
import styles from './player.module.css';

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
		<div className={styles.playerPage}>
			<a href="#player-content" className={styles.skipLink}>
				Skip to player content
			</a>
			<BoxscoreProvider>
				<PlayerErrorBoundary>
					<PlayerHeader />
				</PlayerErrorBoundary>
				<main id="player-content" tabIndex={-1} className={styles.playerMain}>
					<PlayerErrorBoundary>
						<PlayerContent />
					</PlayerErrorBoundary>
				</main>
			</BoxscoreProvider>
		</div>
	);
};

export default Player;
