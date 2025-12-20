import apiClient from '../apiClient';

export type TeamCreatePayload = { name: string; [k: string]: unknown };
export type TeamUpdatePayload = Partial<TeamCreatePayload> & { id: number };

export async function createTeam(payload: TeamCreatePayload) {
	const res = await apiClient.post('/teams', payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createTeam failed: ${res.status}`);
}

export async function updateTeam(payload: TeamUpdatePayload) {
	const res = await apiClient.put(`/teams/${payload.id}`, payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateTeam failed: ${res.status}`);
}

export async function listTeams() {
	const res = await apiClient.get<import('../../types/api/team').TeamDetailsResponse[]>('/teams');
	if (res.status >= 200 && res.status < 300) return res.data ?? [];
	return [];
}
