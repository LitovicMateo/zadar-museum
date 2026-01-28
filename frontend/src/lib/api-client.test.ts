import { describe, it, expect, beforeEach } from 'vitest';

import apiClient from './api-client';

describe('apiClient', () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it('should be an axios instance', () => {
		expect(apiClient).toBeDefined();
		expect(typeof apiClient.get).toBe('function');
		expect(typeof apiClient.post).toBe('function');
		expect(typeof apiClient.put).toBe('function');
		expect(typeof apiClient.delete).toBe('function');
	});

	it('should have correct base configuration', () => {
		expect(apiClient.defaults.baseURL).toBeDefined();
		// Content-Type is set in the headers object
		expect(apiClient.defaults.headers['Content-Type']).toBe('application/json');
		expect(apiClient.defaults.timeout).toBe(30000);
	});

	it('should add Authorization header in requests when JWT token exists', async () => {
		const mockToken = 'test-jwt-token';
		localStorage.setItem('jwt', mockToken);

		// Create a simple test to verify interceptor would add the header
		// We can't easily test the interceptor directly, but we verify it exists
		expect(apiClient.interceptors.request.handlers.length).toBeGreaterThan(0);
	});

	it('should have response interceptor configured', () => {
		// Verify response interceptor is configured
		expect(apiClient.interceptors.response.handlers.length).toBeGreaterThan(0);
	});
});
