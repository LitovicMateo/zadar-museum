import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';

export const uploadGallery = async (files: FileList | null): Promise<number[]> => {
	if (!files || files.length === 0) return [];

	const formData = new FormData();
	Array.from(files).forEach((file) => {
		formData.append('files', file);
	});

	// Don't set Content-Type - let axios set it automatically with the correct boundary
	const res = await apiClient.post(API_ROUTES.uploadImage, formData, {
		headers: {
			'Content-Type': undefined
		}
	});

	// Strapi returns array of uploaded files with IDs
	return res.data.map((file: { id: number }) => file.id);
};
