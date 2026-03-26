import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { StaffFormData } from '@/schemas/StaffSchema';
import { uploadSingleImage } from '@/utils/UploadSingleImage';

export const updateStaff = async ({ id, ...data }: { id: string } & StaffFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const res = await apiClient.put(API_ROUTES.edit.staff(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			role: data.role,
			image: uploadedImageId
		}
	});

	return res;
};
