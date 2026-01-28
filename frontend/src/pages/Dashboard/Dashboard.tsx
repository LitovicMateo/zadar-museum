import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

import Sidebar from '@/components/sidebar/sidebar';
import { APP_ROUTES } from '@/constants/routes';

const sidebarGroups = [
	{
		label: 'Create ',
		list: [
			{
				path: APP_ROUTES.dashboard.player.create,
				label: 'Player'
			},
			{
				path: APP_ROUTES.dashboard.staff.create,
				label: 'Staff'
			},
			{
				path: APP_ROUTES.dashboard.referee.create,
				label: 'Referee'
			},
			{
				path: APP_ROUTES.dashboard.team.create,
				label: 'Team'
			},
			{
				path: APP_ROUTES.dashboard.coach.create,
				label: 'Coach'
			},
			{
				path: APP_ROUTES.dashboard.game.create,
				label: 'Game'
			},
			{
				path: APP_ROUTES.dashboard.venue.create,
				label: 'Venue'
			},
			{
				path: APP_ROUTES.dashboard.competition.create,
				label: 'Competition'
			}
		]
	},
	{
		label: 'Edit',
		list: [
			{
				path: APP_ROUTES.dashboard.player.edit,
				label: 'Player'
			},
			{
				path: APP_ROUTES.dashboard.staff.edit,
				label: 'Staff'
			},
			{
				path: APP_ROUTES.dashboard.referee.edit,
				label: 'Referee'
			},
			{
				path: APP_ROUTES.dashboard.team.edit,
				label: 'Team'
			},
			{
				path: APP_ROUTES.dashboard.coach.edit,
				label: 'Coach'
			},
			{
				path: APP_ROUTES.dashboard.game.edit,
				label: 'Game'
			},
			{
				path: APP_ROUTES.dashboard.venue.edit,
				label: 'Venue'
			},
			{
				path: APP_ROUTES.dashboard.competition.edit,
				label: 'Competition'
			}
		]
	},
	{
		label: 'Import ',
		list: [
			{
				path: APP_ROUTES.dashboard.playerStats.create,
				label: 'Player Stats'
			},
			{
				path: APP_ROUTES.dashboard.teamStats.create,
				label: 'Team Stats'
			}
		]
	},
	{
		label: 'Edit ',
		list: [
			{
				path: APP_ROUTES.dashboard.playerStats.edit,
				label: 'Player Stats'
			},
			{
				path: APP_ROUTES.dashboard.teamStats.edit,
				label: 'Team Stats'
			}
		]
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
		return sidebarGroups.flatMap((group) =>
			group.list.map((item) => ({ value: item.path, label: `${group.label} ${item.label}` }))
		);
	}, []);

	const currentOption: Option | null = options.find((o) => location.pathname.startsWith(o.value)) || null;

	const handleChange = (selected: Option | null) => {
		if (selected && selected.value) navigate(selected.value);
	};

	return (
		<div className="flex gap-6 h-full bg-slate-50">
			<div className="hidden md:block">
				<Sidebar basePath="dashboard" title="Dashboard" groups={sidebarGroups} />
			</div>
			<div className="py-6 px-4 w-full">
				{isMobile && (
					<div className="mb-6">
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
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
