// src/pages/Stats.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';

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
	const navigate = useNavigate();
	const location = useLocation();

	const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	const options = useMemo(() => {
		return sidebarGroups.flatMap((group) =>
			group.list.map((item) => ({ value: `/stats/${item.path}`, label: item.label }))
		);
	}, []);

	const currentOption = options.find((o) => location.pathname.startsWith(o.value)) || null;

	const handleChange = (selected: any) => {
		if (selected && selected.value) navigate(selected.value);
	};

	return (
		<div className="flex gap-2 w-full">
			<div className="hidden md:block">
				<Sidebar basePath="stats" title="Statistics" groups={sidebarGroups} />
			</div>
			<section className="w-full p-4 overflow-x-scroll">
				{isMobile && (
					<div className="px-2 mb-4">
						<Select
							options={options}
							defaultValue={currentOption}
							onChange={handleChange}
							isSearchable
							styles={{ container: (provided) => ({ ...provided, width: '100%' }) }}
							placeholder="Choose stats DB..."
						/>
					</div>
				)}
				<Outlet />
			</section>
		</div>
	);
};

export default Stats;
