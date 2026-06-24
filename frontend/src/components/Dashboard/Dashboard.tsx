import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';
import { type DashboardNavItem } from '@/components/Sidebar/DashboardSidebarRow';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { APP_ROUTES } from '@/constants/Routes';

import styles from './Dashboard.module.css';

const navItems: DashboardNavItem[] = [
	{ label: 'Player', listPath: APP_ROUTES.dashboard.player.list },
	{ label: 'Staff', listPath: APP_ROUTES.dashboard.staff.list },
	{ label: 'Referee', listPath: APP_ROUTES.dashboard.referee.list },
	{ label: 'Team', listPath: APP_ROUTES.dashboard.team.list },
	{ label: 'Coach', listPath: APP_ROUTES.dashboard.coach.list },
	{ label: 'Game', listPath: APP_ROUTES.dashboard.game.list },
	{ label: 'Venue', listPath: APP_ROUTES.dashboard.venue.list },
	{ label: 'Competition', listPath: APP_ROUTES.dashboard.competition.list },
];

const statsItems: DashboardNavItem[] = [
	{ label: 'Player Stats', listPath: APP_ROUTES.dashboard.playerStats.list },
	{ label: 'Team Stats', listPath: APP_ROUTES.dashboard.teamStats.list },
];

const Dashboard: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	type Option = { value: string; label: string };

	const options: Option[] = useMemo(() => {
		return [...navItems, ...statsItems].map((item) => ({
			value: item.listPath,
			label: item.label,
		}));
	}, []);

	const currentOption: Option | null =
		options.find((o) => location.pathname.startsWith(o.value.replace('/list', ''))) || null;

	const handleChange = (selected: Option | null) => {
		if (selected?.value) navigate(selected.value);
	};

	return (
		<div className={styles.layout}>
			<div className={styles.desktopSidebar}>
				<DashboardSidebar navItems={navItems} statsItems={statsItems} />
			</div>
			<div className={styles.content}>
				{isMobile && (
					<div className={styles.mobileNav}>
						<Select<Option, false>
							options={options}
							defaultValue={currentOption ?? undefined}
							onChange={handleChange}
							isSearchable
							styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
							placeholder="Choose form..."
						/>
					</div>
				)}
				<DynamicContentWrapper>
					<Outlet />
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default Dashboard;
