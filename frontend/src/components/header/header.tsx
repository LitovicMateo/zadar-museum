import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import GlobalSearch from '@/components/global-search/global-search';
import { APP_ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/auth-context';
import 'framer-motion';
import { LogOut } from 'lucide-react';

import MobileInlineSearch from './MobileInlineSearch';
import MobileMenuPanel from './MobileMenuPanel';

const navItems = [
	{ name: 'Home', link: APP_ROUTES.home },
	{ name: 'Dashboard', link: APP_ROUTES.dashboard.default },
	{ name: 'Stats', link: APP_ROUTES.stats.default },
	{ name: 'Games', link: APP_ROUTES.games },
	{ name: 'Teams', link: APP_ROUTES.teams },
	{ name: 'Players', link: APP_ROUTES.players },
	{ name: 'Coaches', link: APP_ROUTES.coaches },
	{ name: 'Staff', link: APP_ROUTES.staffs },
	{ name: 'Competitions', link: APP_ROUTES.leagues },
	{ name: 'Venues', link: APP_ROUTES.venues },
	{ name: 'Referees', link: APP_ROUTES.referees }
];

const Header: React.FC = () => {
	const { logout, isAuthenticated } = useAuth();
	const [navOpen, setNavOpen] = useState(false);
	const [searchInline, setSearchInline] = useState(false);

	if (!isAuthenticated) return null;

	return (
		<header className="sticky top-0 z-50 w-screen bg-white border-b border-gray-200 supports-[backdrop-filter]:bg-white/80">
			<div className="max-w-[900px] w-full mx-auto flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-4">
					<button
						aria-label={navOpen ? 'Close menu' : 'Open menu'}
						onClick={() => {
							setNavOpen((s) => !s);
							if (searchInline) setSearchInline(false);
						}}
						className="md:hidden p-2 rounded hover:bg-gray-100"
					>
						{navOpen ? (
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M18 6L6 18"
									stroke="#374151"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M6 6L18 18"
									stroke="#374151"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						) : (
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M3 6H21"
									stroke="#374151"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M3 12H21"
									stroke="#374151"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M3 18H21"
									stroke="#374151"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
						)}
					</button>

					<h1 className="font-abel uppercase text-lg md:text-2xl">Muzej Zadarske Košarke</h1>
				</div>

				<div className="hidden md:flex items-center gap-4">
					<GlobalSearch />
					<LogOut size={20} onClick={logout} color="#364153" className="cursor-pointer" />
				</div>

				<div className="md:hidden flex items-center">
					<button
						aria-label={searchInline ? 'Close search' : 'Open search'}
						onClick={() => {
							setSearchInline((s) => !s);
							if (navOpen) setNavOpen(false);
							// focus the search input inside the inline container after it opens
							setTimeout(() => {
								const input = document.querySelector(
									'#mobile-inline-search input[placeholder="Search"]'
								) as HTMLInputElement | null;
								if (input) input.focus();
							}, 120);
						}}
						className="p-2 rounded hover:bg-gray-100"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								d="M21 21l-4.35-4.35"
								stroke="#374151"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<circle
								cx="11"
								cy="11"
								r="6"
								stroke="#374151"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</button>
				</div>
			</div>

			<nav className="border-t border-gray-100">
				<ul className="hidden md:flex justify-between max-w-[900px] mx-auto px-4 py-2 text-base">
					{navItems.map((item) => (
						<li key={item.name} className="px-2">
							<Link to={item.link} className="hover:underline">
								{item.name}
							</Link>
						</li>
					))}
				</ul>

				{/* Inline mobile search (shifts layout) */}
				<MobileInlineSearch open={searchInline} />

				{/* Mobile menu as overlay (backdrop + sliding panel from left) */}
				<MobileMenuPanel open={navOpen} setOpen={setNavOpen} navItems={navItems} logout={logout} />
			</nav>
		</header>
	);
};

export default Header;
