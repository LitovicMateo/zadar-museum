import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Pencil, Plus } from 'lucide-react';

import styles from './DashboardSidebar.module.css';

export type DashboardNavItem = {
	label: string;
	createPath: string;
	editPath: string;
};

const DashboardSidebarRow: React.FC<DashboardNavItem> = ({ label, createPath, editPath }) => {
	const { pathname } = useLocation();
	const navigate = useNavigate();

	const createActive = pathname === createPath || pathname.startsWith(createPath + '/');
	const editActive = pathname === editPath || pathname.startsWith(editPath + '/');

	return (
		<li className={styles.row}>
			<span className={styles.rowLabel}>{label}</span>

			<div className={styles.actions}>
				<button
					onClick={() => navigate(createPath)}
					className={`${styles.btnCreate} ${createActive ? styles.btnCreateActive : ''}`}
					title={`Create ${label}`}
					aria-label={`Create ${label}`}
				>
					<Plus size={13} strokeWidth={2.5} />
				</button>

				<button
					onClick={() => navigate(editPath)}
					className={`${styles.btnEdit} ${editActive ? styles.btnEditActive : ''}`}
					title={`Edit ${label}`}
					aria-label={`Edit ${label}`}
				>
					<Pencil size={13} strokeWidth={2.5} />
				</button>
			</div>
		</li>
	);
};

export default DashboardSidebarRow;
