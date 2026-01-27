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
				className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 hover:shadow-sm transition-all duration-200 text-sm group ${
					active
						? 'bg-blue-50 shadow-sm border-l-4 border-blue-500 pl-2'
						: 'border-l-4 border-transparent pl-2'
				}`}
			>
				<span
					className={`w-2 h-2 rounded-full shrink-0 transition-all duration-200 ${
						active ? 'bg-blue-500 shadow-sm' : 'bg-gray-300 group-hover:bg-blue-400'
					}`}
				/>
				<span
					className={`font-medium text-xs truncate transition-colors duration-200 ${
						active ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-600'
					}`}
				>
					{label}
				</span>
			</Link>
		</li>
	);
};

export default SidebarItem;
