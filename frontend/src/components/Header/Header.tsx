import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import GlobalSearch from '@/components/Header/GlobalSearch/GlobalSearch';
import { APP_ROUTES } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/Utils';
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

import MobileInlineSearch, { MobileInlineSearchHandle } from './MobileMenu/MobileInlineSearch';
import MobileMenuPanel from './MobileMenu/MobileMenuPanel';

// Public-facing destinations. Dashboard is an admin affordance and lives in the
// account menu instead of competing with these in the main nav.
const publicNavItems = [
	{ name: 'Home', link: APP_ROUTES.home, icon: Home },
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

const dashboardItem = { name: 'Dashboard', link: APP_ROUTES.dashboard.default, icon: LayoutDashboard };

// Mobile panel keeps every destination, including Dashboard.
const mobileNavItems = [dashboardItem, ...publicNavItems];

type NavItem = (typeof publicNavItems)[number];

const linkClass =
	'block whitespace-nowrap rounded-md px-2.5 py-1.5 text-sm font-medium text-white/80 transition-colors hover:text-white';
const activeLinkClass = 'bg-white/10 text-white';

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
		<ul ref={containerRef} className="relative m-0 flex min-w-0 flex-1 list-none items-center gap-0.5 p-0">
			{items.map((item, i) => (
				<li
					key={item.name}
					ref={(el) => {
						itemRefs.current[i] = el;
					}}
					className="flex"
					style={
						i >= overflowFrom ? { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' } : undefined
					}
				>
					<Link
						to={item.link}
						className={cn(linkClass, pathname === item.link && activeLinkClass)}
						aria-current={pathname === item.link ? 'page' : undefined}
						tabIndex={i >= overflowFrom ? -1 : undefined}
					>
						{item.name}
					</Link>
				</li>
			))}

			<li
				ref={moreRef}
				className="flex"
				style={
					!hasOverflow
						? { position: 'absolute', visibility: 'hidden', pointerEvents: 'none' }
						: { position: 'relative' }
				}
			>
				<button
					className={cn(
						linkClass,
						'inline-flex items-center gap-1',
						moreOpen && activeLinkClass
					)}
					onClick={() => setMoreOpen((s) => !s)}
					aria-expanded={moreOpen}
					aria-haspopup="menu"
				>
					More
					<ChevronDown size={12} strokeWidth={2.5} className={cn('transition-transform', moreOpen && 'rotate-180')} />
				</button>
				{moreOpen && (
					<div
						role="menu"
						className="absolute right-0 top-[calc(100%+4px)] z-[100] flex min-w-40 flex-col gap-0.5 rounded-lg border border-white/15 bg-[color-mix(in_oklab,var(--court)_80%,black)] p-1.5 shadow-xl"
					>
						{overflow.map((item) => (
							<Link
								key={item.name}
								to={item.link}
								className={cn(linkClass, pathname === item.link && activeLinkClass)}
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

const AccountMenu: React.FC<{ logout: () => void }> = ({ logout }) => {
	const { pathname } = useLocation();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onPointer = (e: PointerEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
		document.addEventListener('pointerdown', onPointer);
		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('pointerdown', onPointer);
			document.removeEventListener('keydown', onKey);
		};
	}, [open]);

	return (
		<div ref={ref} className="relative shrink-0">
			<button
				onClick={() => setOpen((s) => !s)}
				aria-expanded={open}
				aria-haspopup="menu"
				aria-label="Account menu"
				className="flex items-center gap-1 rounded-md px-2 py-1.5 text-white/80 transition-colors hover:text-white"
			>
				<UserCog size={18} />
				<ChevronDown size={12} strokeWidth={2.5} className={cn('transition-transform', open && 'rotate-180')} />
			</button>
			{open && (
				<div
					role="menu"
					className="absolute right-0 top-[calc(100%+4px)] z-[100] flex min-w-44 flex-col gap-0.5 rounded-lg border border-white/15 bg-[color-mix(in_oklab,var(--court)_80%,black)] p-1.5 shadow-xl"
				>
					<Link
						to={dashboardItem.link}
						role="menuitem"
						onClick={() => setOpen(false)}
						aria-current={pathname === dashboardItem.link ? 'page' : undefined}
						className={cn(linkClass, 'flex items-center gap-2', pathname === dashboardItem.link && activeLinkClass)}
					>
						<LayoutDashboard size={16} />
						Dashboard
					</Link>
					<button
						role="menuitem"
						onClick={() => {
							setOpen(false);
							logout();
						}}
						className={cn(linkClass, 'flex w-full items-center gap-2 text-left')}
					>
						<LogOut size={16} />
						Logout
					</button>
				</div>
			)}
		</div>
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
		<header className="sticky top-0 z-50 w-screen bg-court text-white shadow-[0_2px_16px_rgba(0,0,0,0.22)]">
			<div className="mx-auto flex h-14 w-full max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-5">
				<button
					aria-label={navOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={navOpen}
					aria-controls="mobile-panel"
					onClick={() => {
						setNavOpen((s) => !s);
						if (searchInline) setSearchInline(false);
					}}
					className="flex items-center justify-center rounded-md p-2 text-white/85 transition-colors hover:text-white md:hidden"
				>
					{navOpen ? <X size={22} /> : <Menu size={22} />}
				</button>

				<Link to={APP_ROUTES.home} className="flex shrink-0 items-center gap-2">
					<span aria-hidden className="h-5 w-1.5 rounded-full bg-record" />
					<span className="font-display text-xs font-extrabold uppercase tracking-[0.08em] text-white sm:text-sm md:text-base">
						{import.meta.env.VITE_APP_NAME ?? 'Muzej Zadarske Košarke'}
					</span>
				</Link>

				<nav className="hidden min-w-0 flex-1 md:flex" aria-label="Primary">
					<NavWithOverflow items={publicNavItems} />
				</nav>

				<div className="hidden items-center gap-2 md:flex">
					<div className="overflow-hidden rounded-md bg-white/95">
						<GlobalSearch />
					</div>
					<AccountMenu logout={logout} />
				</div>

				<button
					aria-label={searchInline ? 'Close search' : 'Open search'}
					aria-expanded={searchInline}
					onClick={handleSearchToggle}
					className="ml-auto flex items-center justify-center rounded-md p-2 text-white/85 transition-colors hover:text-white md:hidden"
				>
					{searchInline ? <X size={20} /> : <Search size={20} />}
				</button>
			</div>

			{/* Inline mobile search (shifts layout) */}
			<MobileInlineSearch ref={inlineSearchRef} open={searchInline} />

			{/* Mobile menu as overlay (backdrop + sliding panel from left) */}
			<MobileMenuPanel open={navOpen} setOpen={setNavOpen} navItems={mobileNavItems} logout={logout} />
		</header>
	);
};

export default Header;
