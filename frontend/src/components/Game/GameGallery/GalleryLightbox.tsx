import React, { useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Dialog, DialogContent, DialogTitle } from '@/components/UI/Dialog';
import { cn } from '@/lib/Utils';
import { GalleryMedia } from '@/types/api/Game';
import { getImageUrl } from '@/utils/GetImageUrl';

import { isVideo } from './utils';

type GalleryLightboxProps = {
	items: GalleryMedia[];
	index: number | null;
	onClose: () => void;
	onNavigate: (index: number) => void;
};

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
	items,
	index,
	onClose,
	onNavigate
}) => {
	const isOpen = index !== null;

	const step = useCallback(
		(delta: number) => {
			if (index === null) return;
			const next = (index + delta + items.length) % items.length;
			onNavigate(next);
		},
		[index, items.length, onNavigate]
	);

	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowLeft') {
				e.preventDefault();
				step(-1);
			} else if (e.key === 'ArrowRight') {
				e.preventDefault();
				step(1);
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [isOpen, step]);

	if (index === null) return null;

	const item = items[index];
	const url = getImageUrl(item.url);

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-[95vw] border-0 bg-transparent p-0 shadow-none sm:max-w-3xl lg:max-w-5xl">
				<DialogTitle className="sr-only">Gallery media</DialogTitle>
				<div className="relative flex items-center justify-center">
					{isVideo(item) ? (
						<video
							key={url}
							src={url}
							controls
							autoPlay
							className="max-h-[80vh] w-full rounded-lg object-contain"
						/>
					) : (
						<img
							src={url}
							alt={item.alt ?? ''}
							className="max-h-[80vh] w-full rounded-lg object-contain"
						/>
					)}

					{items.length > 1 && (
						<>
							<NavButton side="left" onClick={() => step(-1)} />
							<NavButton side="right" onClick={() => step(1)} />
							<span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
								{index + 1} / {items.length}
							</span>
						</>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
};

const NavButton: React.FC<{ side: 'left' | 'right'; onClick: () => void }> = ({
	side,
	onClick
}) => (
	<button
		type="button"
		onClick={onClick}
		aria-label={side === 'left' ? 'Previous' : 'Next'}
		className={cn(
			'absolute top-1/2 -translate-y-1/2 flex size-10 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70',
			'focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
			side === 'left' ? 'left-2' : 'right-2'
		)}
	>
		{side === 'left' ? (
			<ChevronLeft className="size-6" />
		) : (
			<ChevronRight className="size-6" />
		)}
	</button>
);

export default GalleryLightbox;
