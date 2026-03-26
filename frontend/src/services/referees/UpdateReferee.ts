import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { RefereeFormData } from '@/schemas/RefereeSchema';
import { uploadSingleImage } from '@/utils/UploadSingleImage';

export const updateReferee = async ({ id, ...data }: { id: string } & RefereeFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const res = await apiClient.put(API_ROUTES.edit.referee(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			nationality: data.nationality ?? null,
			image: uploadedImageId
		}
	});

	return res;
};
