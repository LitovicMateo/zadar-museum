import React from 'react';

import styles from './TeamFilterBar.module.css';

interface CoachesFilterBarProps {
	SearchInput: React.ReactNode;
}

const TeamFilterBar: React.FC<CoachesFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>
		</div>
	);
};

export default TeamFilterBar;
