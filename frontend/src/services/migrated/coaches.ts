import apiClient from '../apiClient';

export type CoachPayload = { name: string; teamId?: number; [k: string]: any };

export async function createCoach(payload: CoachPayload) {
	const res = await apiClient.post('/coaches', payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createCoach failed: ${res.status}`);
}

export async function updateCoach(id: number, payload: Partial<CoachPayload>) {
	const res = await apiClient.put(`/coaches/${id}`, payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateCoach failed: ${res.status}`);
}
