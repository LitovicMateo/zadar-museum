import React, { useState } from 'react';

import { API_ROUTES } from '@/constants/routes';
import axios from 'axios';

import Button from '../ui/button';

const RefreshDataButton: React.FC = () => {
	const [loading, setLoading] = useState(false);

	const handleRefresh = async () => {
		setLoading(true);

		try {
			const res = await axios.get(API_ROUTES.refresh.views);

			if (!res.data.ok) {
				throw new Error(res.data?.message || 'Failed to refresh views');
			}

			const data = res.data;
			return data;
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<Button
				onClick={handleRefresh}
				disabled={loading}
				className="bg-blue-600! text-white rounded hover:bg-blue-700! disabled:opacity-50 cursor-pointer w-full"
			>
				{loading ? 'Refreshing...' : 'Refresh Materialized Views'}
			</Button>
		</div>
	);
};

export default RefreshDataButton;
