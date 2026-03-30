import { useEffect, useState } from 'react';

import RefreshDataButton from '../UI/RefreshMVButton/RefreshDataButton';
import SidebarContent from './SidebarContent';
import SidebarGroup from './SidebarGroup';
import SidebarItem from './SidebarItem';
import SidebarList from './SidebarList';
import SidebarTitle from './SidebarTitle';
import SidebarToggle from './SidebarToggle';
import SidebarWrapper from './SidebarWrapper';

import styles from './Sidebar.module.css';

type List = {
	label: string;
	path: string;
};

export type SidebarGroup = {
	label: string;
	list: List[];
};

type SidebarProps = {
	basePath: string;
	groups: SidebarGroup[];
	title: string;
};

const Sidebar: React.FC<SidebarProps> = ({ groups, title, basePath }) => {
	const [isOpen, setIsOpen] = useState(true);
	const [shouldRenderContent, setShouldRenderContent] = useState(true);

	useEffect(() => {
		let timeout: NodeJS.Timeout;

		if (isOpen) {
			// Delay showing content
			timeout = setTimeout(() => {
				setShouldRenderContent(true);
			}, 300);
		} else {
			// Immediately hide content
			setShouldRenderContent(false);
		}

		return () => clearTimeout(timeout);
	}, [isOpen]);

	return (
		<div className={styles.container}>
			<SidebarWrapper isOpen={isOpen}>
				{shouldRenderContent && (
					<>
						<SidebarTitle title={title} />
						<SidebarContent>
							{groups.map((group) => (
								<SidebarGroup label={group.label} key={group.label}>
									<SidebarList>
										{group.list.map(({ label, path }) => {
											const resolvedPath = path.startsWith('/') ? path : `/${basePath}/${path}`;
											return <SidebarItem key={resolvedPath} path={resolvedPath} label={label} />;
										})}
									</SidebarList>
								</SidebarGroup>
							))}
							<RefreshDataButton />
						</SidebarContent>
					</>
				)}
			</SidebarWrapper>

			{/* Toggle placed outside the sidebar on the right border */}
			<div className={styles.toggle}>
				<SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>
		</div>
	);
};

export default Sidebar;
