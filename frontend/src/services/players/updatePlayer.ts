import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { PlayerFormData } from '@/schemas/player-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';

export const updatePlayer = async ({ id, ...data }: { id: string } & PlayerFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

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
			nationality: data.nationality ?? null
		}
	});

	return res;
};
