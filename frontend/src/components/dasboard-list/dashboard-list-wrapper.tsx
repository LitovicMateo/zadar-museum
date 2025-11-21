import React from 'react';

const DashboardListWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
	return (
		<div className="w-full max-w-md p-4">
			<div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
				<div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
					<h2 className="text-lg font-semibold text-gray-700 font-mono">Latest {title}</h2>
					<span className="text-xs text-gray-400">Recent</span>
				</div>
				<div className="p-2">{children}</div>
			</div>
		</div>
	);
};

export default DashboardListWrapper;
