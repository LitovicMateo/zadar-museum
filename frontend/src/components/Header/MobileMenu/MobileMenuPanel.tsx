import React from 'react';
import { Link } from 'react-router-dom';

import { AnimatePresence, motion } from 'framer-motion';
import { LogOut, LucideIcon, X } from 'lucide-react';

import styles from './MobileMenuPanel.module.css';

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
						className={styles.overlay}
					/>

					<motion.aside
						id="mobile-panel"
						key="panel"
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ type: 'tween', duration: 0.25 }}
						className={styles.panel}
					>
						<div className={styles.panelHeader}>
							<h2 className={styles.panelTitle}>Menu</h2>
							<div className={styles.panelActions}>
								<button
									aria-label="Close menu"
									onClick={() => setOpen(false)}
									className={styles.closeBtn}
								>
									<X size={20} />
								</button>
							</div>
						</div>

						<nav className={styles.nav}>
							<ul className={styles.navList}>
								{navItems.map((item) => {
									const Icon = item.icon;
									return (
										<li key={item.name}>
											<Link
												to={item.link}
												className={styles.navLink}
												onClick={() => setOpen(false)}
											>
												{Icon && <Icon size={18} strokeWidth={1.75} />}
												{item.name}
											</Link>
										</li>
									);
								})}
							</ul>
						</nav>

						<div className={styles.footer}>
							<button
								onClick={() => {
									setOpen(false);
									logout();
								}}
								className={styles.logoutBtn}
							>
								<LogOut size={18} strokeWidth={1.75} />
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
