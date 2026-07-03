import { useNavigate, useParams } from 'react-router-dom';

import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';

import GameContent from './GameContent';
import GameHeader from './GameHeader/GameHeader';

const Game = () => {
	const { gameId } = useParams();

	const navigate = useNavigate();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game && !isLoading) {
		navigate(APP_ROUTES.games);
	}

	return (
		<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
			<GameHeader />
			<main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6">
				<GameContent />
			</main>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.game.edit}${gameId}`} />
		</div>
	);
};

export default Game;
