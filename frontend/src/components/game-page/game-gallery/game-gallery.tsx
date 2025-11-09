import React, { useRef } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { GameDetailsResponse } from '@/types/api/game';
import { getImageUrl } from '@/utils/getImageUrl';

import './game-gallery.css';

const GameGallery: React.FC = () => {
	const { gameId } = useParams();
	const { data: game, isLoading } = useGameDetails(gameId!);

	const images = game?.gallery;

	const galleryRef = useRef<ImageGallery>(null);
	if (!images) return null;
	const imagesData: ReactImageGalleryItem[] = transformImages(images!);

	if (isLoading) return null;

	return (
		<section className="flex flex-col gap-4 ">
			<Heading title="Gallery" />
			<div className="bg-white px-2 py-4 rounded-sm max-w-[1100px] w-full mx-auto">
				<ImageGallery
					ref={galleryRef}
					showPlayButton={false}
					items={imagesData}
					onClick={() => {
						galleryRef.current?.fullScreen();
					}}
					renderCustomControls={() => null}
				/>
			</div>
		</section>
	);
};

export default GameGallery;

function transformImages(images: GameDetailsResponse['gallery']): ReactImageGalleryItem[] {
	if (!images) return [];
	const gallery = images?.map((image) => {
		const url = getImageUrl(image.url);
		return {
			original: url,
			thumbnail: url,
			originalHeight: image.height
		};
	});
	return gallery;
}
