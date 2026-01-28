import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';

export const uploadSingleImage = async (file: File | null): Promise<number | null> => {
	if (!file) {
		return null;
	}

	const formData = new FormData();
	formData.append('files', file);

	// Don't set Content-Type - let axios set it automatically with the correct boundary
	const res = await apiClient.post(API_ROUTES.uploadImage, formData, {
		headers: {
			'Content-Type': undefined
		}
	});

	if (res.status === 201) {
		return res.data[0].id;
	}

	return null;
};
