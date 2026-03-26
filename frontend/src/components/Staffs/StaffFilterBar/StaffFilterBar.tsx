import React from 'react';

import styles from './StaffFilterBar.module.css';

interface StaffFilterBarProps {
	SearchInput: React.ReactNode;
}

const StaffFilterBar: React.FC<StaffFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>
		</div>
	);
};

export default StaffFilterBar;
