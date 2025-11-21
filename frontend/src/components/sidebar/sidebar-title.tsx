import React from 'react';

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className="w-full flex items-center gap-3 px-2">
			<div className="bg-blue-600 text-white rounded-md w-9 h-9 flex items-center justify-center font-bold">
				D
			</div>
			<div>
				<h2 className="text-base font-semibold text-gray-800 font-mono">{title}</h2>
				<div className="text-xs text-gray-400">Admin panel</div>
			</div>
		</div>
	);
};

export default SidebarTitle;
