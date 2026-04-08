import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import DashboardSidebar from '@/components/Sidebar/DashboardSidebar';
import { type DashboardNavItem } from '@/components/Sidebar/DashboardSidebarRow';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { APP_ROUTES } from '@/constants/Routes';

import styles from './Dashboard.module.css';

const navItems: DashboardNavItem[] = [
	{ label: 'Player', createPath: APP_ROUTES.dashboard.player.create, editPath: APP_ROUTES.dashboard.player.edit },
	{ label: 'Staff', createPath: APP_ROUTES.dashboard.staff.create, editPath: APP_ROUTES.dashboard.staff.edit },
	{ label: 'Referee', createPath: APP_ROUTES.dashboard.referee.create, editPath: APP_ROUTES.dashboard.referee.edit },
	{ label: 'Team', createPath: APP_ROUTES.dashboard.team.create, editPath: APP_ROUTES.dashboard.team.edit },
	{ label: 'Coach', createPath: APP_ROUTES.dashboard.coach.create, editPath: APP_ROUTES.dashboard.coach.edit },
	{ label: 'Game', createPath: APP_ROUTES.dashboard.game.create, editPath: APP_ROUTES.dashboard.game.edit },
	{ label: 'Venue', createPath: APP_ROUTES.dashboard.venue.create, editPath: APP_ROUTES.dashboard.venue.edit },
	{
		label: 'Competition',
		createPath: APP_ROUTES.dashboard.competition.create,
		editPath: APP_ROUTES.dashboard.competition.edit
	}
];

const statsItems: DashboardNavItem[] = [
	{
		label: 'Player Stats',
		createPath: APP_ROUTES.dashboard.playerStats.create,
		editPath: APP_ROUTES.dashboard.playerStats.edit
	},
	{
		label: 'Team Stats',
		createPath: APP_ROUTES.dashboard.teamStats.create,
		editPath: APP_ROUTES.dashboard.teamStats.edit
	}
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
		return [...navItems, ...statsItems].flatMap((item) => [
			{ value: item.createPath, label: `Create ${item.label}` },
			{ value: item.editPath, label: `Edit ${item.label}` }
		]);
	}, []);

	const currentOption: Option | null = options.find((o) => location.pathname.startsWith(o.value)) || null;

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
