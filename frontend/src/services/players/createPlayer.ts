import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { PlayerFormData } from '@/schemas/player-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';

export const createPlayer = async (data: PlayerFormData) => {
	const uploadedImageId = await uploadSingleImage(data.image);

	const params = new URLSearchParams({
		'filters[first_name][$eq]': data.first_name,
		'filters[last_name][$eq]': data.last_name
	});

	const existingPlayer = await apiClient.get(API_ROUTES.create.player(params.toString()));

	if (existingPlayer.data.data.length > 0) {
		throw new Error('Player already exists');
	}

	const playerPayload = {
		first_name: data.first_name,
		last_name: data.last_name,
		date_of_birth: data.date_of_birth || null,
		date_of_death: data.date_of_death || null,
		is_active_player: data.active_player,
		primary_position: data.primary_position || null,
		secondary_position: data.secondary_position || null,
		height: data.height || null,
		image: uploadedImageId,
		nationality: data.nationality ?? null
	};

	return apiClient.post(API_ROUTES.create.player(), {
		data: playerPayload
	});
};
