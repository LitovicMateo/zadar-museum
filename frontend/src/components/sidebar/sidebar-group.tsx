import React from 'react';

type SidebarGroupProps = {
	label?: string;
	children: React.ReactNode;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
	return (
		<div id="group" className="p-2 border-2 border-solid border-gray-200 rounded-sm">
			{label && (
				<p className="text-sm uppercase text-gray-500 pb-1 mb-1 border-b-1 border-solid border-gray-300 text-center">
					{label}
				</p>
			)}
			{children}
		</div>
	);
};

export default SidebarGroup;
