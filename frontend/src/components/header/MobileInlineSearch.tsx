import React from 'react';

import GlobalSearch from '@/components/global-search/GlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './MobileInlineSearch.module.css';

interface Props {
	open: boolean;
}

const MobileInlineSearch: React.FC<Props> = ({ open }) => {
	return (
		<AnimatePresence>
			{open && (
				<motion.div
					id="mobile-inline-search"
					initial={{ height: 0, opacity: 0 }}
					animate={{ height: 'auto', opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={{ duration: 0.18 }}
					className={styles.wrapper}
				>
					<div className={styles.inner}>
						<div className={styles.searchBox}>
							<GlobalSearch />
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default MobileInlineSearch;
