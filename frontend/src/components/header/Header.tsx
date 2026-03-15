import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import GlobalSearch from '@/components/global-search/GlobalSearch';
import { APP_ROUTES } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import 'framer-motion';
import { LogOut } from 'lucide-react';

import MobileInlineSearch from './MobileInlineSearch';
import MobileMenuPanel from './MobileMenuPanel';
import styles from './Header.module.css';

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
		<header className={styles.header}>
			<div className={styles.inner}>
				<div className={styles.logoGroup}>
					<button
						aria-label={navOpen ? 'Close menu' : 'Open menu'}
						onClick={() => {
							setNavOpen((s) => !s);
							if (searchInline) setSearchInline(false);
						}}
						className={styles.hamburgerBtn}
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

					<h1 className={styles.title}>Muzej Zadarske Košarke</h1>
				</div>

				<div className={styles.desktopNav}>
					<GlobalSearch />
					<LogOut size={20} onClick={logout} color="#364153" className={styles.logoutBtn} />
				</div>

				<div className={styles.mobileSearch}>
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
						className={styles.menuBtn}
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

			<nav className={styles.nav}>
				<ul className={styles.navList}>
					{navItems.map((item) => (
						<li key={item.name} className={styles.navItem}>
							<Link to={item.link} className={styles.navLink}>
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
