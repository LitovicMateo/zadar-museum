import React from 'react';
import { Outlet } from 'react-router-dom';

import Sidebar from '@/components/sidebar/sidebar';
import { APP_ROUTES } from '@/constants/routes';

const sidebarGroups = [
	{
		label: 'Create new objects',
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
		label: 'Edit objects',
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
		label: 'Import Stats',
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
		label: 'Edit Stats',
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
