import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

import { useQuery as useReactQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';

/**
 * Custom useQuery wrapper that automatically shows toast notifications for errors.
 *
 * Usage:
 * ```ts
 * const { data } = useQuery({
 *   queryKey: ['myKey'],
 *   queryFn: myQueryFn,
 *   errorMessage: 'Failed to load data' // Optional custom error message
 * });
 * ```
 */
export function useQuery<
	TQueryFnData = unknown,
	TError = Error,
	TData = TQueryFnData,
	TQueryKey extends readonly unknown[] = readonly unknown[]
>(
	options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> & {
		errorMessage?: string;
	}
): UseQueryResult<TData, TError> {
	const { errorMessage, ...queryOptions } = options;
	const result = useReactQuery(queryOptions);
	const previousErrorRef = useRef<TError | null>(null);

	// Show toast notification when error occurs or changes
	useEffect(() => {
		if (result.error && result.error !== previousErrorRef.current) {
			const message = errorMessage || 'An error occurred while fetching data';
			toast.error(message);
			previousErrorRef.current = result.error;
		} else if (!result.error) {
			previousErrorRef.current = null;
		}
	}, [result.error, errorMessage]);

	return result;
}
