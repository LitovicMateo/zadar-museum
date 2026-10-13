import React from 'react';
import { useParams } from 'react-router-dom';

import MediaGallery from '@/components/Game/GameGallery/MediaGallery';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';

const PlayerMedia: React.FC = () => {
	const { playerId } = useParams();
	const { data: player } = usePlayerDetails(playerId!);

	if (!player?.gallery || player.gallery.length === 0) return null;

	return <MediaGallery items={player.gallery} />;
};

export default PlayerMedia;
