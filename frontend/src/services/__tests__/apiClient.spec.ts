import { describe, it, expect, vi, beforeEach } from 'vitest';
import apiClient from '@/services/apiClient';

describe('apiClient', () => {
	beforeEach(() => {
		vi.restoreAllMocks();
		// reset localStorage
		Object.defineProperty(global, 'localStorage', {
			value: {
				getItem: vi.fn(),
				setItem: vi.fn(),
				removeItem: vi.fn()
			}
		});
	});

	it('parses JSON responses', async () => {
		(global as any).localStorage.getItem.mockReturnValue(null);

		global.fetch = vi.fn().mockResolvedValue({
			status: 200,
			ok: true,
			text: async () => JSON.stringify({ hello: 'world' })
		});

		const res = await apiClient.get('/ping');
		expect(res.status).toBe(200);
		expect(res.data).toEqual({ hello: 'world' });
	});

	it('attempts refresh on 401 and retries request', async () => {
		// initial request -> 401
		// refresh call -> 200 with new accessToken
		// retry -> 200 with data
		const calls: Array<any> = [];

		(global as any).localStorage.getItem.mockImplementation((key: string) => {
			if (key === 'refreshToken') return 'refresh-token';
			return null;
		});

		global.fetch = vi.fn((input: any, init: any) => {
			calls.push({ input, init });
			if (typeof input === 'string' && input.endsWith('/auth/refresh')) {
				return Promise.resolve({ status: 200, ok: true, text: async () => JSON.stringify({ accessToken: 'newtoken' }) });
			}

			// first call to resource -> 401
			if (calls.length === 1) {
				return Promise.resolve({ status: 401, ok: false, text: async () => '' });
			}

			// retry -> success
			return Promise.resolve({ status: 200, ok: true, text: async () => JSON.stringify({ pong: true }) });
		});

		const res = await apiClient.get('/secure');
		expect(res.status).toBe(200);
		expect(res.data).toEqual({ pong: true });
		expect((global as any).localStorage.setItem).toHaveBeenCalledWith('accessToken', 'newtoken');
	});
});
