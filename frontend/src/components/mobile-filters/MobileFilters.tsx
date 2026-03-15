import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import styles from '@/components/mobile-filters/MobileFilters.module.css';

type Props = {
	children: React.ReactNode; // filter component
	SearchInput?: React.ReactNode; // optional search input element
	title?: string;
};

const MobileFilters: React.FC<Props> = ({ children, SearchInput, title = 'Filters' }) => {
	const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
	const [show, setShow] = useState(false);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	if (!isMobile) return <>{children}</>;

	return (
		<div>
			<div className={styles.trigger}>
				<button
					className={styles.btn}
					onClick={() => setShow(true)}
					aria-expanded={show}
				>
					{title}
				</button>
				<div className={styles.searchSlot}>{SearchInput}</div>
			</div>

			<AnimatePresence>
				{show && (
					<motion.div
						className={styles.overlay}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<motion.div
							className={styles.backdrop}
							onClick={() => setShow(false)}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.18 }}
						/>

						<motion.div
							className={`${styles.sheet} mobile-filters-modal`}
							initial={{ y: '100%' }}
							animate={{ y: 0 }}
							exit={{ y: '100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
						>
							<style>{`.mobile-filters-modal button{background-color:#4f46e5 !important;color:#fff !important;border-radius:4px !important}`}</style>
							<div className={styles.sheetHeader}>
								<h3 className={styles.sheetTitle}>{title}</h3>
								<button
									className={styles.btn}
									onClick={() => setShow(false)}
									aria-label="Close filters"
								>
									Close
								</button>
							</div>
							{children}
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default MobileFilters;
