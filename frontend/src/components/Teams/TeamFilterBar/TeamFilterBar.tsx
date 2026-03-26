import React from 'react';

import styles from './TeamFilterBar.module.css';

interface TeamsFilterBarProps {
	SearchInput: React.ReactNode;
}

const TeamFilterBar: React.FC<TeamsFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>
		</div>
	);
};

export default TeamFilterBar;
