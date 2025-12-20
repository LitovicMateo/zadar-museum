import apiClient from '../apiClient';

export type GamePayload = { date: string; homeTeamId: number; awayTeamId: number; [k: string]: unknown };

export async function createGame(payload: GamePayload) {
	const res = await apiClient.post('/games', payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`createGame failed: ${res.status}`);
}

export async function updateGame(id: number, payload: Partial<GamePayload>) {
	const res = await apiClient.put(`/games/${id}`, payload);
	if (res.status >= 200 && res.status < 300) return res.data;
	throw new Error(`updateGame failed: ${res.status}`);
}
