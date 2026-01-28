import React from 'react';

type SidebarGroupProps = {
	label?: string;
	children: React.ReactNode;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
	return (
		<div id="group" className="">
			{label && (
				<div className="text-xs font-semibold text-gray-500 uppercase mb-3 px-2 tracking-wider">{label}</div>
			)}
			<div className="space-y-1">{children}</div>
		</div>
	);
};

export default SidebarGroup;
