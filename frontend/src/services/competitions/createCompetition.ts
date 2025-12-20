import slugify from 'react-slugify';

import { API_ROUTES } from '@/constants/routes';
import apiClient, { unwrapSingle } from '@/services/apiClient';
import { CompetitionFormData } from '@/types/api/competition';

export const createCompetiton = async (data: CompetitionFormData) => {
	const res = await apiClient.post(API_ROUTES.create.competition(), {
		data: {
			name: data.name,
			short_name: data.short_name,
			slug: slugify(data.name),
			alternate_names: data.alternate_names,
			trophies: data.trophies
		}
	});

	if (res.status >= 200 && res.status < 300)
		return unwrapSingle<Record<string, unknown>>(res as unknown as { data?: unknown });

	throw new Error(`createCompetiton failed: ${res.status}`);
};
