import React from 'react';

type SidebarGroupProps = {
	label?: string;
	children: React.ReactNode;
};

const SidebarGroup: React.FC<SidebarGroupProps> = ({ label, children }) => {
	return (
		<div id="group" className="px-2 py-1">
			{label && <div className="text-xs text-gray-400 uppercase mb-2">{label}</div>}
			<div className="space-y-1">{children}</div>
		</div>
	);
};

export default SidebarGroup;
