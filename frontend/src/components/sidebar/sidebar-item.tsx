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
				className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors text-sm ${
					active ? 'bg-white text-blue-700 font-semibold border border-blue-700' : 'text-gray-700'
				}`}
			>
				<span
					className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
						active ? 'bg-blue-500' : 'bg-gray-300'
					}`}
				/>
				<span className="uppercase font-mono text-xs truncate">{label}</span>
			</Link>
		</li>
	);
};

export default SidebarItem;
