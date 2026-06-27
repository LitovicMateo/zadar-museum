import React from 'react';

import { GalleryMedia } from '@/types/api/Game';

import GalleryThumb from './GalleryThumb';

type GalleryGridProps = {
	items: GalleryMedia[];
	onSelect: (index: number) => void;
};

const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onSelect }) => {
	return (
		<div className="columns-1 gap-3 sm:columns-2 lg:columns-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
			{items.map((item, index) => (
				<GalleryThumb
					key={`${item.url}-${index}`}
					item={item}
					onSelect={() => onSelect(index)}
				/>
			))}
		</div>
	);
};

export default GalleryGrid;
