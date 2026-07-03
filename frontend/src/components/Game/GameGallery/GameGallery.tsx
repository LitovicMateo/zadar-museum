import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';

import SectionHeading from '../SectionHeading';
import GalleryGrid from './GalleryGrid';
import GalleryLightbox from './GalleryLightbox';

const GameGallery: React.FC = () => {
	const { gameId } = useParams();
	const { data: game, isLoading } = useGameDetails(gameId!);
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const images = game?.gallery;

	if (isLoading || !images || images.length === 0) return null;

	return (
		<section className="my-8">
			<SectionHeading title="Gallery" />
			<GalleryGrid items={images} onSelect={setSelectedIndex} />
			<GalleryLightbox
				items={images}
				index={selectedIndex}
				onClose={() => setSelectedIndex(null)}
				onNavigate={setSelectedIndex}
			/>
		</section>
	);
};

export default GameGallery;
