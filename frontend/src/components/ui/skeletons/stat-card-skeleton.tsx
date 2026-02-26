import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

const StatCardSkeleton: React.FC = () => {
	return (
		<div className="flex justify-between px-2 py-2 border-b-1 border-solid border-gray-500">
			<Skeleton className="h-6 w-24" />
			<div className="flex gap-2 items-baseline">
				<Skeleton className="h-6 w-12" />
				<Skeleton className="h-5 w-10" />
			</div>
		</div>
	);
};

export default StatCardSkeleton;
