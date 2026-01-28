import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useQuery } from './use-query-with-toast';

const createWrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0
			}
		}
	});

	return ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};

describe('useQueryWithToast', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('should work like regular useQuery when no error occurs', async () => {
		const mockData = { id: 1, name: 'Test' };
		const queryFn = vi.fn().mockResolvedValue(mockData);

		const { result } = renderHook(
			() =>
				useQuery({
					queryKey: ['test'],
					queryFn,
					errorMessage: 'Test error message'
				}),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => expect(result.current.isSuccess).toBe(true));

		expect(result.current.data).toEqual(mockData);
		expect(queryFn).toHaveBeenCalledTimes(1);
	});

	it('should handle errors gracefully', async () => {
		const mockError = new Error('Test error');
		const queryFn = vi.fn().mockRejectedValue(mockError);

		const { result } = renderHook(
			() =>
				useQuery({
					queryKey: ['test-error'],
					queryFn,
					errorMessage: 'Failed to load data'
				}),
			{ wrapper: createWrapper() }
		);

		await waitFor(() => expect(result.current.isError).toBe(true));

		expect(result.current.error).toBeTruthy();
		expect(queryFn).toHaveBeenCalledTimes(1);
	});

	it('should accept all standard useQuery options', async () => {
		const mockData = { id: 1, name: 'Test' };
		const queryFn = vi.fn().mockResolvedValue(mockData);

		const { result } = renderHook(
			() =>
				useQuery({
					queryKey: ['test-options'],
					queryFn,
					enabled: false, // Should not execute
					errorMessage: 'Test error'
				}),
			{ wrapper: createWrapper() }
		);

		// Should remain idle because enabled is false
		expect(result.current.isLoading).toBe(false);
		expect(queryFn).not.toHaveBeenCalled();
	});
});
