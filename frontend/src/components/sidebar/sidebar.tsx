import { useEffect, useState } from 'react';

import RefreshDataButton from '../refresh-data-button/refresh-data-button';
import SidebarContent from './sidebar-content';
import SidebarGroup from './sidebar-group';
import SidebarItem from './sidebar-item';
import SidebarList from './sidebar-list';
import SidebarTitle from './sidebar-title';
import SidebarToggle from './sidebar-toggle';
import SidebarWrapper from './sidebar-wrapper';

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
		<div className="relative inline-block">
			<SidebarWrapper isOpen={isOpen}>
				{shouldRenderContent && (
					<>
						<SidebarTitle title={title} />
						<SidebarContent>
							{groups.map((group) => (
								<SidebarGroup label={group.label} key={group.label}>
									<SidebarList>
										{group.list.map(({ label, path }) => (
											<SidebarItem key={path} path={`/${basePath}/${path}`} label={label} />
										))}
									</SidebarList>
								</SidebarGroup>
							))}
							<RefreshDataButton />
						</SidebarContent>
					</>
				)}
			</SidebarWrapper>

			{/* Toggle placed outside the sidebar on the right border */}
			<div className="absolute top-4 left-full ml-2">
				<SidebarToggle isOpen={isOpen} setIsOpen={setIsOpen} />
			</div>
		</div>
	);
};

export default Sidebar;
