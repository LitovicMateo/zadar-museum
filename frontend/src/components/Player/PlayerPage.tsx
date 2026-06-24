import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PlayerErrorBoundary } from '@/components/Player/PlayerErrorBoundary';
import PlayerHeader from '@/components/Player/PlayerHeader/PlayerHeader';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import ProfilePageWrapper from '@/components/UI/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { BoxscoreProvider } from '@/context/PlayerGamelogContext';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';

import PlayerContent from './Content/PlayerContent';

import styles from './PlayerPage.module.css';

export type PlayerDB = 'main' | 'opponent';

const PlayerPage: React.FC = () => {
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
		<BoxscoreProvider>
			<ProfilePageWrapper
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
			/>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.player.edit}${playerId}`} />
		</BoxscoreProvider>
	);
};

export default PlayerPage;
