import React, { useState } from 'react';

import { GalleryMedia } from '@/types/api/Game';

import SectionHeading from '../SectionHeading';
import GalleryGrid from './GalleryGrid';
import GalleryLightbox from './GalleryLightbox';

type MediaGalleryProps = {
	items: GalleryMedia[];
};

const MediaGallery: React.FC<MediaGalleryProps> = ({ items }) => {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	return (
		<section className="my-8">
			<SectionHeading title="Gallery" />
			<GalleryGrid items={items} onSelect={setSelectedIndex} />
			<GalleryLightbox
				items={items}
				index={selectedIndex}
				onClose={() => setSelectedIndex(null)}
				onNavigate={setSelectedIndex}
			/>
		</section>
	);
};

export default MediaGallery;
