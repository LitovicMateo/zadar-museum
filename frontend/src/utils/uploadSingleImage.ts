import { API_ROUTES } from '@/constants/routes';
import axios from 'axios';

export const uploadSingleImage = async (file: File | null): Promise<number | null> => {
	if (!file) {
		return null;
	}

	const formData = new FormData();
	formData.append('files', file);

	const res = await axios.post(API_ROUTES.uploadImage, formData);

	if (res.status === 201) {
		const files = res.data as unknown as Array<{ id: number }>;
		return files[0].id;
	}

	return null;
};
