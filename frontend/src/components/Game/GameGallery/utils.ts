import { GalleryMedia } from '@/types/api/Game';

export const isVideo = (item: GalleryMedia): boolean =>
	item.mime?.startsWith('video/') ?? false;
