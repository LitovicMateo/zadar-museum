import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { PlayerFormData } from '@/schemas/PlayerSchema';
import { uploadGallery } from '@/utils/UploadGallery';
import { uploadSingleImage } from '@/utils/UploadSingleImage';

export const updatePlayer = async ({ id, ...data }: { id: string } & PlayerFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);
	const galleryIds = await uploadGallery(data.gallery);

	const res = await apiClient.put(API_ROUTES.edit.player(id), {
		data: {
			first_name: data.first_name,
			last_name: data.last_name,
			// ensure empty strings are converted to null
			date_of_birth: data.date_of_birth && data.date_of_birth !== '' ? data.date_of_birth : null,
			date_of_death: data.date_of_death && data.date_of_death !== '' ? data.date_of_death : null,
			is_active_player: data.active_player,
			primary_position: data.primary_position || null,
			secondary_position: data.secondary_position || null,
			height: data.height || undefined,
			image: uploadedImageId,
			gallery: galleryIds,
			nationality: data.nationality ?? null
		}
	});

	return res;
};
