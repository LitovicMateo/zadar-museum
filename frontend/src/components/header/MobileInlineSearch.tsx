import { forwardRef, useImperativeHandle, useRef } from 'react';

import GlobalSearch from '@/components/global-search/GlobalSearch';
import { AnimatePresence, motion } from 'framer-motion';

import styles from './MobileInlineSearch.module.css';

export interface MobileInlineSearchHandle {
	focus: () => void;
}

interface Props {
	open: boolean;
}

const MobileInlineSearch = forwardRef<MobileInlineSearchHandle, Props>(({ open }, ref) => {
	const wrapperRef = useRef<HTMLDivElement>(null);

	useImperativeHandle(ref, () => ({
		focus: () => {
			const input = wrapperRef.current?.querySelector<HTMLInputElement>('input');
			input?.focus();
		}
	}));

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
					<div ref={wrapperRef} className={styles.inner}>
						<div className={styles.searchBox}>
							<GlobalSearch />
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
});

MobileInlineSearch.displayName = 'MobileInlineSearch';

export default MobileInlineSearch;
