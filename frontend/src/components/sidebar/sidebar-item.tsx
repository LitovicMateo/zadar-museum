import React from 'react';
import { Link, useLocation } from 'react-router-dom';

type SidebarItemProps = {
	path: string;
	label: string;
};
const SidebarItem: React.FC<SidebarItemProps> = ({ label, path }) => {
	const { pathname } = useLocation();
	const active = pathname === path || pathname.startsWith(path + '/');

	return (
		<li>
			<Link
				to={path}
				className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-sm ${
					active ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
				}`}
			>
				<span className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
				<span className="uppercase font-mono text-xs truncate">{label}</span>
			</Link>
		</li>
	);
};

export default SidebarItem;
