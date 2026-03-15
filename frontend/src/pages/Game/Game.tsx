import { useNavigate, useParams } from 'react-router-dom';

import GameHeader from '@/components/game-page/game-header/GameHeader';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';

import GameContent from './GameContent';

import styles from '@/pages/Game/Game.module.css';

const Game = () => {
	const { gameId } = useParams();

	const navigate = useNavigate();

	const { data: game, isLoading } = useGameDetails(gameId!);

	if (!game && !isLoading) {
		navigate(APP_ROUTES.games);
	}

	return (
		<DynamicContentWrapper>
			<section className={styles.page}>
				<GameHeader />
				<GameContent />
			</section>
		</DynamicContentWrapper>
	);
};

export default Game;
