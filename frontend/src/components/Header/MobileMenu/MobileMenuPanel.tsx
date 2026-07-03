import React from 'react';
import { Link } from 'react-router-dom';

import { Sheet, SheetContent, SheetTitle } from '@/components/UI/Sheet';
import { LogOut, LucideIcon } from 'lucide-react';

interface NavItem {
	name: string;
	link: string;
	icon?: LucideIcon;
}

interface Props {
	open: boolean;
	setOpen: (v: boolean) => void;
	navItems: NavItem[];
	logout: () => void;
}

const MobileMenuPanel: React.FC<Props> = ({ open, setOpen, navItems, logout }) => {
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetContent
				side="left"
				className="bg-court border-r border-white/15 text-court-foreground flex flex-col p-0 w-[80vw] max-w-xs gap-0 [&>button]:text-white/70 [&>button]:hover:bg-white/10 [&>button]:hover:text-white"
			>
				<SheetTitle className="sr-only">Navigation Menu</SheetTitle>

				<div className="flex items-center px-4 py-3 border-b border-white/10">
					<span className="font-display text-xs uppercase tracking-[0.05em] font-extrabold text-white">
						Menu
					</span>
				</div>

				<nav className="flex-1 overflow-y-auto p-3">
					<ul className="flex flex-col gap-0.5 list-none m-0 p-0 text-sm font-medium">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<li key={item.name}>
									<Link
										to={item.link}
										onClick={() => setOpen(false)}
										className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
									>
										{Icon && <Icon size={18} strokeWidth={1.75} />}
										{item.name}
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="border-t border-white/10 p-3">
					<button
						onClick={() => {
							setOpen(false);
							logout();
						}}
						className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-destructive/20 hover:text-red-400"
					>
						<LogOut size={18} strokeWidth={1.75} />
						<span>Logout</span>
					</button>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileMenuPanel;
