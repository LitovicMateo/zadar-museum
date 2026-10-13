import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { GalleryMedia } from '@/types/api/Game';

/** Gallery form state: media already saved on the entity plus files picked but not yet uploaded. */
export type GalleryFormValue = {
	existing: GalleryMedia[];
	files: File[];
};

const uploadFiles = async (files: File[]): Promise<number[]> => {
	if (files.length === 0) return [];

	const formData = new FormData();
	files.forEach((file) => formData.append('files', file));

	// Don't set Content-Type - let axios set it automatically with the correct boundary
	const res = await apiClient.post(API_ROUTES.uploadImage, formData, {
		headers: {
			'Content-Type': undefined
		}
	});

	// Strapi returns array of uploaded files with IDs
	return res.data.map((file: { id: number }) => file.id);
};

/** Uploads newly picked files and returns the full list of media ids to save on the entity. */
export const uploadGallery = async (value: GalleryFormValue | null | undefined): Promise<number[]> => {
	if (!value) return [];

	const existingIds = value.existing.flatMap((m) => (m.id != null ? [m.id] : []));
	const newIds = await uploadFiles(value.files);
	return [...existingIds, ...newIds];
};
