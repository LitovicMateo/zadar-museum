import apiClient from '../apiClient';

export type PlayerCreatePayload = {
	name: string;
	teamId?: number;
	[k: string]: any;
};

export type PlayerUpdatePayload = Partial<PlayerCreatePayload> & { id: number };

export async function createPlayer(payload: PlayerCreatePayload) {
	const res = await apiClient.post('/players', payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createPlayer failed: ${res.status}`);
}

export async function updatePlayer(payload: PlayerUpdatePayload) {
	const res = await apiClient.put(`/players/${payload.id}`, payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updatePlayer failed: ${res.status}`);
}

export async function getPlayer(id: number) {
	const res = await apiClient.get(`/players/${id}`);
	if (res.status >= 200 && res.status < 300) return res.data;
	return null;
}

export async function listPlayers(query?: Record<string, any>) {
	const qs = query ? '?' + new URLSearchParams(Object.entries(query).map(([k, v]) => [k, String(v)])).toString() : '';
	const res = await apiClient.get(`/players${qs}`);
	if (res.status >= 200 && res.status < 300) return res.data;
	return [];
}
