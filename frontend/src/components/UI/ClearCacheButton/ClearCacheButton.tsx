import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { API_ROUTES } from '@/constants/Routes';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import apiClient from '@/lib/ApiClient';
import Button from '../Button';

import styles from '@/components/UI/ClearCacheButton/ClearCacheButton.module.css';

const ClearCacheButton: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const handleClearCache = async () => {
		setLoading(true);
		const toastId = toast.loading('Clearing cache…');

		try {
			const res = await apiClient.get(API_ROUTES.refresh.views);

			if (!res.data.success) {
				throw new Error(res.data?.message || 'Failed to clear cache');
			}

			const { count } = res.data as { count: number };

			// Invalidate all React Query caches so the UI reflects the freshly
			// refreshed materialized views without requiring a second action.
			await queryClient.invalidateQueries();

			toast.success(`Cache cleared and refreshed ${count} view(s).`, {
				id: toastId,
				duration: 5000
			});

			return res.data;
		} catch (err) {
			const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
			const message =
				axiosErr.response?.data?.error?.message ??
				(err instanceof Error ? err.message : 'Failed to clear cache');

			toast.error(message, { id: toastId, duration: 6000 });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Button
				variant="outline"
				size="sm"
				onClick={handleClearCache}
				disabled={loading}
				className={styles.btn}
			>
				{loading ? 'Clearing cache…' : 'Clear cache'}
			</Button>
		</div>
	);
};

export default ClearCacheButton;
