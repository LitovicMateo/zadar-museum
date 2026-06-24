import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './SidebarItem.module.css';

type SidebarItemProps = {
	path: string;
	label: string;
};
const SidebarItem: React.FC<SidebarItemProps> = ({ label, path }) => {
	return (
		<li>
			<NavLink to={path} className={({ isActive }) => `${styles.row} ${isActive ? styles.rowActive : ''}`} end={false}>
				{label}
			</NavLink>
		</li>
	);
};

export default SidebarItem;
