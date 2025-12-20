// Centralized API client for frontend services
// - Uses fetch and Vite `VITE_API_ROOT` for base URL
// - Attaches `Authorization: Bearer <token>` when available
// - Implements single in-flight refresh flow for 401 -> refresh

type Json = any;

const API_ROOT = (import.meta as any).env?.VITE_API_ROOT || '';

let refreshingPromise: Promise<string | null> | null = null;

async function getLocalAccessToken(): Promise<string | null> {
	try {
		// support existing key `jwt` used across the app, fallback to `accessToken`
		return localStorage.getItem('jwt') || localStorage.getItem('accessToken');
	} catch {
		return null;
	}
}

async function setLocalAccessToken(token: string | null) {
	try {
		// keep compatibility with existing `jwt` key
		if (token === null) {
			localStorage.removeItem('accessToken');
			localStorage.removeItem('jwt');
		} else {
			localStorage.setItem('accessToken', token);
			localStorage.setItem('jwt', token);
		}
	} catch {}
}

async function refreshToken(): Promise<string | null> {
	if (refreshingPromise) return refreshingPromise;

	refreshingPromise = (async () => {
		try {
			const refresh = localStorage.getItem('refreshToken');
			if (!refresh) return null;
			const res = await fetch(`${API_ROOT}/auth/refresh`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ refreshToken: refresh })
			});
			if (!res.ok) {
				await setLocalAccessToken(null);
				return null;
			}
			const data = await res.json();
			const newToken = data?.accessToken ?? null;
			await setLocalAccessToken(newToken);
			return newToken;
		} catch (e) {
			await setLocalAccessToken(null);
			return null;
		} finally {
			refreshingPromise = null;
		}
	})();

	return refreshingPromise;
}

async function request<T = Json>(
	input: string,
	init: RequestInit = {},
	tryRefresh = true
): Promise<{ status: number; data?: T; error?: any }> {
	const token = await getLocalAccessToken();

	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(init.headers as Record<string, string>)
	};
	if (token) headers['Authorization'] = `Bearer ${token}`;

	const res = await fetch(input.startsWith('http') ? input : `${API_ROOT}${input}`, {
		...init,
		headers
	});

	if (res.status === 401 && tryRefresh) {
		const newToken = await refreshToken();
		if (newToken) {
			headers['Authorization'] = `Bearer ${newToken}`;
			const retry = await fetch(input.startsWith('http') ? input : `${API_ROOT}${input}`, {
				...init,
				headers
			});
			const text = await retry.text();
			try {
				const json = JSON.parse(text);
				return { status: retry.status, data: json as T };
			} catch {
				return { status: retry.status, data: text as unknown as T };
			}
		}
	}

	const text = await res.text();
	if (!text) return { status: res.status };
	try {
		const json = JSON.parse(text);
		return { status: res.status, data: json as T };
	} catch (err) {
		return { status: res.status, data: text as unknown as T };
	}
}

export const apiClient = {
	get: <T = Json>(path: string) => request<T>(path, { method: 'GET' }),
	post: <T = Json>(path: string, body?: any) =>
		request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
	put: <T = Json>(path: string, body?: any) =>
		request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
	del: <T = Json>(path: string) => request<T>(path, { method: 'DELETE' }),
	// helpers to manage tokens in storage for now (auth-provider should coordinate)
	getLocalAccessToken,
	setLocalAccessToken
};

export default apiClient;
