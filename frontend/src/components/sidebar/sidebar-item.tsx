import React from 'react';
import { Link } from 'react-router-dom';

type SidebarItemProps = {
	path: string;
	label: string;
};
const SidebarItem: React.FC<SidebarItemProps> = ({ label, path }) => {
	return (
		<li className="text-center pb-1 cursor-pointer hover:bg-gray-100 hover:text-gray-800! rounded-t-md">
			<Link to={path} className="hover:text-blue-800! uppercase font-mono text-xs">
				{label}
			</Link>
		</li>
	);
};

export default SidebarItem;
