import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';

export const uploadSingleImage = async (file: File | any | null): Promise<number | null> => {
	if (!file) return null;

	// If it's already a Strapi image object with an `id`, return it
	if (typeof file === 'object' && 'id' in file && typeof file.id === 'number') {
		return file.id as number;
	}

	// Only attempt upload for actual File objects
	if (!(file instanceof File)) return null;

	const formData = new FormData();
	formData.append('files', file);

	// Don't set Content-Type - let axios set it automatically with the correct boundary
	const res = await apiClient.post(API_ROUTES.uploadImage, formData, {
		headers: {
			'Content-Type': undefined
		}
	});

	if (res.status === 201 || res.status === 200) {
		// API may return array or object depending on config
		if (Array.isArray(res.data) && res.data.length > 0) return res.data[0].id;
		if (res.data && res.data[0] && res.data[0].id) return res.data[0].id;
	}

	return null;
};
