import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';

import MediaGallery from './MediaGallery';

const GameGallery: React.FC = () => {
	const { gameId } = useParams();
	const { data: game, isLoading } = useGameDetails(gameId!);

	const items = game?.gallery;

	if (isLoading || !items || items.length === 0) return null;

	return <MediaGallery items={items} />;
};

export default GameGallery;
