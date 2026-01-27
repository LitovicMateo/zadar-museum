import React from 'react';

import { cn } from '@/lib/utils';

interface StatCardProps {
	label: string;
	value: number | string;
	rank?: number;
	className?: string;
	showBorder?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, rank, className, showBorder = true }) => {
	return (
		<div
			className={cn(
				'flex justify-between px-4 py-3 sm:py-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-200 hover:shadow-sm hover:translate-x-1 group',
				showBorder && 'border-b border-gray-200',
				className
			)}
		>
			<div className="font-abel text-base sm:text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
				{label}
			</div>
			<div className="flex gap-2 items-baseline">
				<span className="font-bold font-abel text-lg sm:text-xl tabular-nums text-gray-900">{value}</span>
				{rank !== undefined && (
					<span className="text-blue-600 font-abel text-sm sm:text-base font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
						#{rank}
					</span>
				)}
			</div>
		</div>
	);
};

export default StatCard;
