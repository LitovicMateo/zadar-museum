import React from 'react';
import { Search } from 'lucide-react';

import styles from './StaffFilterBar.module.css';

interface StaffFilterBarProps {
	SearchInput: React.ReactNode;
}

const StaffFilterBar: React.FC<StaffFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>
		</div>
	);
};

export default StaffFilterBar;
