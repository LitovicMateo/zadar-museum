import React from 'react';

const DashboardListWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
	return (
		<div className="w-full max-w-md bg-gray-50 h-full p-4 border-r-1 border-l-1 border-solid border-gray-100">
			<h2 className="text-2xl font-bold text-gray-500 uppercase font-mono mb-2">Latest {title}</h2>
			{children}
		</div>
	);
};

export default DashboardListWrapper;
