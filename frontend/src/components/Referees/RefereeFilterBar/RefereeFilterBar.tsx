import React from 'react';

import styles from './RefereeFilterBar.module.css';

interface RefereeFilterBarProps {
	SearchInput: React.ReactNode;
}

const RefereeFilterBar: React.FC<RefereeFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>
		</div>
	);
};

export default RefereeFilterBar;
