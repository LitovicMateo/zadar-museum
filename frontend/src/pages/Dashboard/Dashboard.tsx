import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/sidebar/sidebar';

const sidebarGroups = [
	{
		label: 'Create new objects',
		list: [
			{
				path: 'player/create',
				label: 'Player'
			},
			{
				path: 'staff/create',
				label: 'Staff'
			},
			{
				path: 'referee/create',
				label: 'Referee'
			},
			{
				path: 'team/create',
				label: 'Team'
			},
			{
				path: 'coach/create',
				label: 'Coach'
			},
			{
				path: 'game/create',
				label: 'Game'
			},
			{
				path: 'venue/create',
				label: 'Venue'
			},
			{
				path: 'competition/create',
				label: 'Competition'
			}
		]
	},
	{
		label: 'Edit objects',
		list: [
			{
				path: 'player/edit',
				label: 'Player'
			},
			{
				path: 'staff/edit',
				label: 'Staff'
			},
			{
				path: 'referee/edit',
				label: 'Referee'
			},
			{
				path: 'team/edit',
				label: 'Team'
			},
			{
				path: 'coach/edit',
				label: 'Coach'
			},
			{
				path: 'game/edit',
				label: 'Game'
			},
			{
				path: 'venue/edit',
				label: 'Venue'
			},
			{
				path: 'competition/edit',
				label: 'Competition'
			}
		]
	},
	{
		label: 'Import Stats',
		list: [
			{
				path: 'player-stats/create',
				label: 'Player Stats'
			},
			{
				path: 'team-stats/create',
				label: 'Team Stats'
			}
		]
	},
	{
		label: 'Edit Stats',
		list: [
			{
				path: 'player-stats/edit',
				label: 'Player Stats'
			},
			{
				path: 'team-stats/edit',
				label: 'Team Stats'
			}
		]
	}
];

const Dashboard: React.FC = () => {
	return (
		<div className="flex  gap-4 h-full  ">
			<Sidebar basePath="dashboard" title="Dashboard" groups={sidebarGroups} />
			<div className="py-6 w-full">
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
