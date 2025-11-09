import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';

const navItems = [
	{ name: 'Home', link: APP_ROUTES.home },
	{ name: 'Dashboard', link: APP_ROUTES.dashboard.default },
	{ name: 'Stats', link: APP_ROUTES.stats.default },
	{ name: 'Games', link: APP_ROUTES.games },
	{ name: 'Teams', link: APP_ROUTES.teams },
	{ name: 'Players', link: APP_ROUTES.players },
	{ name: 'Coaches', link: APP_ROUTES.coaches },
	{ name: 'Leagues', link: APP_ROUTES.leagues },
	{ name: 'Venues', link: APP_ROUTES.venues },
	{ name: 'Referees', link: APP_ROUTES.referees }
];

const Header: React.FC = () => {
	return (
		<header
			className="
        sticky top-0 z-50
        w-screen flex justify-center items-center gap-8
        border-b border-solid border-gray-200
        py-1 font-abel text-sm
        bg-white backdrop-blur supports-[backdrop-filter]:bg-white/80
      "
		>
			<nav className="w-full max-w-[800px]">
				<ul className="flex justify-between text-base w-full px-4">
					{navItems.map((item) => (
						<li key={item.name}>
							<Link to={item.link} className="hover:underline">
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</header>
	);
};

export default Header;
