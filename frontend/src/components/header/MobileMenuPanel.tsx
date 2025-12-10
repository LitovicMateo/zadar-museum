import React from 'react';
import { Link } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

interface NavItem {
	name: string;
	link: string;
}

interface Props {
	open: boolean;
	setOpen: (v: boolean) => void;
	navItems: NavItem[];
	logout: () => void;
}

const MobileMenuPanel: React.FC<Props> = ({ open, setOpen, navItems, logout }) => {
	return (
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						key="backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={() => setOpen(false)}
						className="fixed inset-0 bg-black/30 md:hidden z-60"
					/>

					<motion.aside
						id="mobile-panel"
						key="panel"
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ type: 'tween', duration: 0.25 }}
						className="fixed top-0 left-0 h-full w-[80%] max-w-xs bg-white shadow-lg md:hidden z-70"
					>
						<div className="flex items-center justify-between px-4 py-3 border-b">
							<h2 className="font-abel uppercase text-base">Menu</h2>
							<div className="flex items-center gap-2">
								<button
									aria-label="Close menu"
									onClick={() => setOpen(false)}
									className="p-2 rounded hover:bg-gray-100"
								>
									<svg
										width="20"
										height="20"
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
								</button>
							</div>
						</div>

						<nav className="px-4 py-4">
							<ul className="flex flex-col gap-3 text-base">
								{navItems.map((item) => (
									<li key={item.name}>
										<Link
											to={item.link}
											className="block py-2 hover:underline"
											onClick={() => setOpen(false)}
										>
											{item.name}
										</Link>
									</li>
								))}
							</ul>
						</nav>

						<div className="mt-auto px-4 py-4 border-t">
							<button
								onClick={() => {
									setOpen(false);
									logout();
								}}
								className="w-full flex items-center gap-3 text-left text-base text-gray-700 hover:bg-gray-100 p-2 rounded"
							>
								<LogOut size={22} color="#364153" />
								<span>Logout</span>
							</button>
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>
	);
};

export default MobileMenuPanel;
