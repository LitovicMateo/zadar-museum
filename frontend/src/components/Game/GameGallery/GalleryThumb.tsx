import React from 'react';
import { Play } from 'lucide-react';

import { cn } from '@/lib/Utils';
import { GalleryMedia } from '@/types/api/Game';
import { getImageUrl } from '@/utils/GetImageUrl';

import { isVideo } from './utils';

type GalleryThumbProps = {
	item: GalleryMedia;
	onSelect: () => void;
};

const GalleryThumb: React.FC<GalleryThumbProps> = ({ item, onSelect }) => {
	const url = getImageUrl(item.url);

	return (
		<button
			type="button"
			onClick={onSelect}
			className={cn(
				'group relative block w-full overflow-hidden rounded-md border border-border bg-muted',
				'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
			)}
		>
			{isVideo(item) ? (
				<>
					<video
						src={url}
						muted
						playsInline
						preload="metadata"
						className="w-full object-cover transition-transform duration-200 group-hover:scale-105"
					/>
					<span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
						<span className="flex size-12 items-center justify-center rounded-full bg-black/60 text-white">
							<Play className="size-6 translate-x-0.5 fill-current" />
						</span>
					</span>
				</>
			) : (
				<img
					src={url}
					alt={item.alt ?? ''}
					loading="lazy"
					className="w-full object-cover transition-transform duration-200 group-hover:scale-105"
				/>
			)}
		</button>
	);
};

export default GalleryThumb;
