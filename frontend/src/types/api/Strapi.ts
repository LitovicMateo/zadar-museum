export interface StrapiImageFormat {
	ext: string;
	url: string;
	hash: string;
	mime: string;
	name: string;
	path: string | null;
	size: number;
	width: number;
	height: number;
	sizeInBytes: number;
}

export interface StrapiImage {
	id: number;
	documentId: string;
	name: string;
	alternativeText: string | null;
	caption: string | null;
	width: number;
	height: number;
	formats: {
		large?: StrapiImageFormat;
		medium?: StrapiImageFormat;
		small?: StrapiImageFormat;
		thumbnail?: StrapiImageFormat;
	};
	hash: string;
	ext: string;
	mime: string;
	size: number;
	url: string;
	previewUrl: string | null;
	provider: string;
	provider_metadata: unknown | null;
	createdAt: string;
	updatedAt: string;
	publishedAt: string;
}
