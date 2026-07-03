import React from 'react';
import { Search } from 'lucide-react';

import styles from './RefereeFilterBar.module.css';

interface RefereeFilterBarProps {
	SearchInput: React.ReactNode;
}

const RefereeFilterBar: React.FC<RefereeFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>
		</div>
	);
};

export default RefereeFilterBar;
