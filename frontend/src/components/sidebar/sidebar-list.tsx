import React from 'react';

type SidebarListProps = {
	children: React.ReactNode;
};
const SidebarList: React.FC<SidebarListProps> = ({ children }) => {
	return (
		<ul
			className="text-gray-700 text-sm flex flex-col gap-1 
               [&>*]:border-b [&>*]:border-gray-200 [&>*]:border-solid 
               [&>*:last-child]:border-b-0"
		>
			{children}
		</ul>
	);
};

export default SidebarList;
