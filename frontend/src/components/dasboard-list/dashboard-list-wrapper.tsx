import React from 'react';

const DashboardListWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
	return (
		<div className="w-full max-w-md">
			<div className="bg-white border-2 border-gray-200 rounded-xl shadow-md overflow-hidden">
				<div className="px-5 py-4 bg-gradient-to-r from-slate-50 to-white border-b-2 border-gray-200 flex items-center justify-between">
					<div>
						<h2 className="text-lg font-bold text-gray-900">Latest {title}</h2>
						<p className="text-xs text-gray-500 mt-0.5">Recently added entries</p>
					</div>
				</div>
				<div className="p-3">{children}</div>
			</div>
		</div>
	);
};

export default DashboardListWrapper;
