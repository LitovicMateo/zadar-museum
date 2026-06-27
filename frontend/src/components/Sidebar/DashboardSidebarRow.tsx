import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './DashboardSidebar.module.css';

export type DashboardNavItem = {
	label: string;
	listPath: string;
};

const DashboardSidebarRow: React.FC<DashboardNavItem> = ({ label, listPath }) => {
	return (
		<li>
			<NavLink
				to={listPath}
				className={({ isActive }) =>
					`${styles.row} ${isActive ? styles.rowActive : ''}`
				}
				end={false}
			>
				{label}
			</NavLink>
		</li>
	);
};

export default DashboardSidebarRow;
