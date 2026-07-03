// src/pages/Stats.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import Sidebar, { SidebarGroup } from '@/components/Sidebar/Sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/Select';

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
			},
			{
				path: 'compare',
				label: 'Compare'
			}
		]
	}
];

const Stats: React.FC = () => {
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
			group.list.map((item) => ({ value: `/stats/${item.path}`, label: item.label }))
		);
	}, []);

	const currentOption: Option | null = options.find((o) => location.pathname.startsWith(o.value)) || null;

	return (
		<div className="flex h-full min-h-0 w-full gap-2 bg-chalk">
			<div className="hidden md:block">
				<Sidebar basePath="stats" title="Statistics" groups={sidebarGroups} />
			</div>
			<section className="h-full min-h-0 w-full min-w-0 overflow-y-auto bg-chalk p-4">
				{isMobile && (
					<div className="mb-4">
						<Select value={currentOption?.value ?? ''} onValueChange={(value) => navigate(value)}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Choose stats..." />
							</SelectTrigger>
							<SelectContent>
								{options.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				)}
				<Outlet />
			</section>
		</div>
	);
};

export default Stats;
