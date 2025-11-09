// src/pages/Stats.tsx
import { Outlet } from 'react-router-dom';

import Sidebar, { SidebarGroup } from '@/components/sidebar/sidebar';

const sidebarGroups: SidebarGroup[] = [
	{
		label: 'Choose stat database',
		list: [
			{
				path: 'player',
				label: 'Player stats'
			},
			{
				path: 'player-records',
				label: 'Player records'
			},
			{
				path: 'team',
				label: 'Team stats'
			},
			{
				path: 'team-records',
				label: 'Team records'
			},
			{
				path: 'coach',
				label: 'Coach stats'
			},
			{
				path: 'referee',
				label: 'Referee stats'
			}
		]
	}
];

const Stats = () => {
	return (
		<div className="flex gap-2 w-full">
			<Sidebar basePath="stats" title="Statistics" groups={sidebarGroups} />
			<section className="w-full p-4 overflow-x-scroll">
				<Outlet />
			</section>
		</div>
	);
};

export default Stats;
