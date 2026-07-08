import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';

import { buildLeagueTablePayload } from './CreateLeagueTable';

export const updateLeagueTable = async ({ id, ...data }: { id: string } & LeagueTableFormData) => {
	const res = await apiClient.put(API_ROUTES.edit.leagueTable(id), {
		data: buildLeagueTablePayload(data)
	});
	return res;
};
