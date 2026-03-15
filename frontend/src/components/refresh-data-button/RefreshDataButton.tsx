import React, { useState } from 'react';

import { API_ROUTES } from '@/constants/Routes';
import axios, { AxiosError } from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import Button from '../ui/Button';
import styles from '@/components/refresh-data-button/RefreshDataButton.module.css';

const RefreshDataButton: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const queryClient = useQueryClient();

	const handleRefresh = async () => {
		setLoading(true);
		const toastId = toast.loading('Refreshing materialized views…');

		try {
			const res = await axios.get(API_ROUTES.refresh.views);

			if (!res.data.success) {
				throw new Error(res.data?.message || 'Failed to refresh views');
			}

			const { count } = res.data as { count: number };

			// Invalidate all React Query caches so the UI reflects the freshly
			// refreshed materialized views without requiring a second refresh.
			await queryClient.invalidateQueries();

			toast.success(`Refreshed ${count} materialized view(s) successfully.`, {
				id: toastId,
				duration: 5000,
			});

			return res.data;
		} catch (err) {
			const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
			const message =
				axiosErr.response?.data?.error?.message ??
				(err instanceof Error ? err.message : 'Failed to refresh views');

			toast.error(message, { id: toastId, duration: 6000 });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Button
				onClick={handleRefresh}
				disabled={loading}
				className={styles.btn}
			>
				{loading ? 'Refreshing…' : 'Refresh Materialized Views'}
			</Button>
		</div>
	);
};

export default RefreshDataButton;
