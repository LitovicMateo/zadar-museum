import { useNavigate, useParams } from 'react-router-dom';

import GameHeader from '@/components/game-page/game-header/game-header';
import { APP_ROUTES } from '@/constants/routes';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';

import GameContent from './GameContent';

const Game = () => {
	const { gameId } = useParams();

	const navigate = useNavigate();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game && !isLoading) {
		navigate(APP_ROUTES.games);
	}

	return (
		<section className="w-full flex flex-col gap-6 justify-start overflow-y-auto pt-6">
			<GameHeader />
			<GameContent />
		</section>
	);
};

export default Game;
