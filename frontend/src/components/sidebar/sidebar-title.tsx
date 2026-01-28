import React from 'react';

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => {
	return (
		<div className="w-full flex flex-col gap-2 pb-4 border-b-2 border-gray-200">
			<div className="flex items-center gap-3">
				<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold shadow-md">
					<span className="text-lg">{title.charAt(0)}</span>
				</div>
				<div>
					<h2 className="text-lg font-bold text-gray-900">{title}</h2>
					<div className="text-xs text-gray-500 font-medium">Admin Panel</div>
				</div>
			</div>
		</div>
	);
};

export default SidebarTitle;
