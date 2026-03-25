import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { VenueFormData } from '@/schemas/VenueSchema';
import { uploadSingleImage } from '@/utils/UploadSingleImage';

export const updateVenue = async ({ id, ...data }: { id: string } & VenueFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const res = await apiClient.put(API_ROUTES.edit.venue(id), {
		data: {
			name: data.name,
			city: data.city,
			country: data.country,
			image: uploadedImageId
		}
	});

	return res;
};
