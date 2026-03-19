import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import GlobalSearch from '@/components/global-search/GlobalSearch';
import { APP_ROUTES } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import {
	BarChart2,
	Briefcase,
	ChevronDown,
	Flag,
	Home,
	LayoutDashboard,
	LogOut,
	MapPin,
	Medal,
	Menu,
	Search,
	Trophy,
	User,
	UserCog,
	Users,
	X
} from 'lucide-react';

import MobileInlineSearch, { MobileInlineSearchHandle } from './MobileInlineSearch';
import MobileMenuPanel from './MobileMenuPanel';

import styles from './Header.module.css';

const navItems = [
	{ name: 'Home', link: APP_ROUTES.home, icon: Home },
	{ name: 'Dashboard', link: APP_ROUTES.dashboard.default, icon: LayoutDashboard },
	{ name: 'Stats', link: APP_ROUTES.stats.default, icon: BarChart2 },
	{ name: 'Games', link: APP_ROUTES.games, icon: Trophy },
	{ name: 'Teams', link: APP_ROUTES.teams, icon: Users },
	{ name: 'Players', link: APP_ROUTES.players, icon: User },
	{ name: 'Coaches', link: APP_ROUTES.coaches, icon: UserCog },
	{ name: 'Staff', link: APP_ROUTES.staffs, icon: Briefcase },
	{ name: 'Competitions', link: APP_ROUTES.leagues, icon: Medal },
	{ name: 'Venues', link: APP_ROUTES.venues, icon: MapPin },
	{ name: 'Referees', link: APP_ROUTES.referees, icon: Flag }
];

type NavItem = (typeof navItems)[number];

// Renders nav links that fit in one row; overflowing items collapse into a "More" dropdown.
// Uses ResizeObserver + useLayoutEffect so the cutoff recalculates before paint.
const NavWithOverflow: React.FC<{ items: NavItem[] }> = ({ items }) => {
	const { pathname } = useLocation();
	const containerRef = useRef<HTMLUListElement>(null);
	const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
	const moreRef = useRef<HTMLLIElement>(null);
	const [overflowFrom, setOverflowFrom] = useState<number>(items.length);
	const [moreOpen, setMoreOpen] = useState(false);

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const recalc = () => {
			const available = container.offsetWidth;
			const moreW = moreRef.current?.offsetWidth ?? 72;
			let used = 0;
			let cutoff = items.length;

			for (let i = 0; i < items.length; i++) {
				const el = itemRefs.current[i];
				if (!el) {
					cutoff = i;
					break;
				}
				const w = el.offsetWidth;
				// Reserve space for "More" unless this is the last item
				const needsMore = i < items.length - 1;
				if (used + w + (needsMore ? moreW : 0) > available) {
					cutoff = i;
					break;
				}
				used += w;
			}
			setOverflowFrom(cutoff);
		};

		recalc();
		const ro = new ResizeObserver(recalc);
		ro.observe(container);
		return () => ro.disconnect();
	}, [items.length]);

	// Close on outside click or Escape
	useEffect(() => {
		if (!moreOpen) return;
		const onPointer = (e: PointerEvent) => {
			if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
				setMoreOpen(false);
			}
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setMoreOpen(false);
		};
		document.addEventListener('pointerdown', onPointer);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onPointer);
			document.removeEventListener('keydown', onKey);
		};
	}, [moreOpen]);

	const overflow = items.slice(overflowFrom);
	const hasOverflow = overflow.length > 0;

	return (
		<ul ref={containerRef} className={styles.navList}>
			{items.map((item, i) => (
				<li
					key={item.name}
					ref={(el) => {
						itemRefs.current[i] = el;
					}}
					className={styles.navItem}
					// Keep in DOM for measurement but hide visually when overflowed
					style={
						i >= overflowFrom
							? { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }
							: undefined
					}
				>
					<Link
						to={item.link}
						className={styles.navLink}
						aria-current={pathname === item.link ? 'page' : undefined}
						tabIndex={i >= overflowFrom ? -1 : undefined}
					>
						{item.name}
					</Link>
				</li>
			))}

			{/* Always in DOM so its width is measurable; hidden when no overflow */}
			<li
				ref={moreRef}
				className={styles.navItem}
				style={
					!hasOverflow
						? { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }
						: { position: 'relative' }
				}
			>
				<button
					className={styles.moreTrigger}
					onClick={() => setMoreOpen((s) => !s)}
					aria-expanded={moreOpen}
					aria-haspopup="menu"
				>
					More
					<ChevronDown size={12} strokeWidth={2.5} className={styles.moreTriggerChevron} />
				</button>
				{moreOpen && (
					<div className={styles.moreDropdown} role="menu">
						{overflow.map((item) => (
							<Link
								key={item.name}
								to={item.link}
								className={styles.moreDropdownLink}
								role="menuitem"
								onClick={() => setMoreOpen(false)}
								aria-current={pathname === item.link ? 'page' : undefined}
							>
								{item.name}
							</Link>
						))}
					</div>
				)}
			</li>
		</ul>
	);
};

const Header: React.FC = () => {
	const { logout, isAuthenticated } = useAuth();
	const [navOpen, setNavOpen] = useState(false);
	const [searchInline, setSearchInline] = useState(false);
	const inlineSearchRef = useRef<MobileInlineSearchHandle>(null);

	if (!isAuthenticated) return null;

	const handleSearchToggle = () => {
		const opening = !searchInline;
		setSearchInline(opening);
		if (navOpen) setNavOpen(false);
		if (opening) {
			requestAnimationFrame(() => inlineSearchRef.current?.focus());
		}
	};

	return (
		<header className={styles.header}>
			<div className={styles.inner}>
				<div className={styles.logoGroup}>
					<button
						aria-label={navOpen ? 'Close menu' : 'Open menu'}
						aria-expanded={navOpen}
						aria-controls="mobile-panel"
						onClick={() => {
							setNavOpen((s) => !s);
							if (searchInline) setSearchInline(false);
						}}
						className={styles.hamburgerBtn}
					>
						{navOpen ? <X size={22} /> : <Menu size={22} />}
					</button>
				</div>

				<h1 className={styles.title}>Muzej Zadarske Košarke</h1>

				<div className={styles.desktopNav}>
					<div className={styles.searchWrapper}>
						<GlobalSearch />
					</div>
					<LogOut size={20} onClick={logout} className={styles.logoutBtn} />
				</div>

				<div className={styles.mobileSearch}>
					<button
						aria-label={searchInline ? 'Close search' : 'Open search'}
						aria-expanded={searchInline}
						onClick={handleSearchToggle}
						className={styles.menuBtn}
					>
						{searchInline ? <X size={20} /> : <Search size={20} />}
					</button>
				</div>
			</div>

			<nav className={styles.nav}>
				<div className={styles.navInner}>
					<NavWithOverflow items={navItems} />
				</div>

				{/* Inline mobile search (shifts layout) */}
				<MobileInlineSearch ref={inlineSearchRef} open={searchInline} />

				{/* Mobile menu as overlay (backdrop + sliding panel from left) */}
				<MobileMenuPanel open={navOpen} setOpen={setNavOpen} navItems={navItems} logout={logout} />
			</nav>
		</header>
	);
};

export default Header;
