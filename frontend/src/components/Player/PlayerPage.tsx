import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PlayerErrorBoundary } from '@/components/Player/PlayerErrorBoundary';
import PlayerHero from '@/components/Player/PlayerHero/PlayerHero';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { BoxscoreProvider } from '@/context/PlayerGamelogContext';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';

import PlayerContent from './Content/PlayerContent';

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
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<PlayerErrorBoundary>
					<PlayerHero />
				</PlayerErrorBoundary>
				<main id="player-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<PlayerErrorBoundary>
						<PlayerContent />
					</PlayerErrorBoundary>
				</main>
			</div>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.player.edit}${playerId}`} />
		</BoxscoreProvider>
	);
};

export default PlayerPage;
