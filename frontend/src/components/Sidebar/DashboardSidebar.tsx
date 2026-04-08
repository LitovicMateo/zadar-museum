import React, { useEffect, useState } from 'react';

import RefreshDataButton from '../UI/RefreshMVButton/RefreshDataButton';
import DashboardSidebarRow, { type DashboardNavItem } from './DashboardSidebarRow';
import SidebarContent from './SidebarContent';
import SidebarTitle from './SidebarTitle';
import SidebarToggle from './SidebarToggle';
import SidebarWrapper from './SidebarWrapper';

import styles from './DashboardSidebar.module.css';

type DashboardSidebarProps = {
	navItems: DashboardNavItem[];
	statsItems: DashboardNavItem[];
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ navItems, statsItems }) => {
	const [isOpen, setIsOpen] = useState(true);
	const [shouldRenderContent, setShouldRenderContent] = useState(true);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;

		if (isOpen) {
			timeout = setTimeout(() => setShouldRenderContent(true), 300);
		} else {
			setShouldRenderContent(false);
		}

		return () => clearTimeout(timeout);
	}, [isOpen]);

	return (
		<div className={styles.container}>
			<SidebarWrapper isOpen={isOpen}>
				{shouldRenderContent && (
					<div className={styles.sidebar}>
						<SidebarTitle title="Dashboard" />

						<SidebarContent>
							<div>
								<div className={styles.sectionLabel}>Manage</div>
								<ul className={styles.list}>
									{navItems.map((item) => (
										<DashboardSidebarRow key={item.label} {...item} />
									))}
								</ul>
							</div>

							<div className={styles.divider} />

							<div>
								<div className={styles.sectionLabel}>Stats</div>
								<ul className={styles.list}>
									{statsItems.map((item) => (
										<DashboardSidebarRow key={item.label} {...item} />
									))}
								</ul>
							</div>

							<RefreshDataButton />
						</SidebarContent>
					</div>
				)}
			</SidebarWrapper>

			<div className={styles.toggle}>
				<SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>
		</div>
	);
};

export default DashboardSidebar;
