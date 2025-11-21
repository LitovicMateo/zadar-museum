import React from 'react';

type SidebarListProps = {
	children: React.ReactNode;
};
const SidebarList: React.FC<SidebarListProps> = ({ children }) => {
	return <ul className="text-gray-700 text-sm flex flex-col divide-y divide-gray-100">{children}</ul>;
};

export default SidebarList;
