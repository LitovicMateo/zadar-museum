import React, { useRef } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { useParams } from 'react-router-dom';

import Heading from '@/components/UI/Heading';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { GameDetailsResponse } from '@/types/api/Game';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './GameGallery.module.css';
import './game-gallery.css';

const GameGallery: React.FC = () => {
	const { gameId } = useParams();
	const { data: game, isLoading } = useGameDetails(gameId!);

	const images = game?.gallery;

	const galleryRef = useRef<{ fullScreen?: () => void } | null>(null);
	if (!images) return null;
	const imagesData = transformImages(images!);

	if (isLoading) return null;

	return (
		<section className={styles.section}>
			<Heading title="Gallery" />
			<div className={styles.galleryWrap}>
				<ImageGallery
					ref={galleryRef}
					showPlayButton={false}
					items={imagesData}
					onClick={() => {
						galleryRef.current?.fullScreen?.();
					}}
					renderCustomControls={() => null}
				/>
			</div>
		</section>
	);
};

export default GameGallery;

type GalleryItem = { original: string; thumbnail: string; originalHeight?: number };

function transformImages(images: GameDetailsResponse['gallery']): GalleryItem[] {
	if (!images) return [];
	return images.map((image) => {
		const url = getImageUrl(image.url);
		return {
			original: url,
			thumbnail: url,
			originalHeight: image.height
		} as GalleryItem;
	});
}
