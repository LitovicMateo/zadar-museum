import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import { TeamFormData } from '@/schemas/team-schema';
import { uploadSingleImage } from '@/utils/uploadSingleImage';
import axios from 'axios';

export const updateTeam = async ({ id, ...data }: { id: string } & TeamFormData) => {
	// Determine image payload:
	// - If user provided a File -> upload and use returned id
	// - If user left existing image (Strapi image object) -> use its id
	// - If user removed image (null) -> send null to clear the image
	let imagePayload: number | null | undefined = undefined;

	// new file upload
	if (data.image instanceof File) {
		const uploadedImageId = await uploadSingleImage(data.image);
		// if upload failed, keep imagePayload undefined so we don't clear existing image
		if (uploadedImageId != null) {
			imagePayload = uploadedImageId;
		}
	} else if (data.image === null) {
		// explicit removal requested
		imagePayload = null;
	} else if (typeof data.image === 'object' && data.image !== null && 'id' in data.image) {
		// existing Strapi image object — narrow and read `id` safely
		const imageObj = data.image as { id?: number };
		if (typeof imageObj.id === 'number') {
			imagePayload = imageObj.id;
		}
	}

	// build payload, include image only when we have a definitive value (number or null)
	const payload: Record<string, unknown> = {
		name: data.name,
		alternate_names: data.alternate_names,
		short_name: data.short_name,
		slug: slugify(data.name),
		city: data.city,
		country: data.country
	};

	if (imagePayload !== undefined) {
		payload.image = imagePayload;
	}

	const res = await axios.put(API_ROUTES.edit.team(id), {
		data: payload
	});

	return res;
};
