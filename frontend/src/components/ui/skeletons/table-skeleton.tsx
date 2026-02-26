import React from 'react';

import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
	rows?: number;
	columns?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4 }) => {
	return (
		<div className="w-full">
			{/* Header */}
			<div className="flex gap-4 px-2 py-2 bg-slate-100 border-b-1 border-solid border-gray-500">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={`header-${i}`} className="h-6 flex-1" />
				))}
			</div>
			{/* Rows */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={`row-${rowIndex}`} className="flex gap-4 px-2 py-2 border-b-1 border-solid border-gray-500">
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-6 flex-1" />
					))}
				</div>
			))}
		</div>
	);
};

export default TableSkeleton;
