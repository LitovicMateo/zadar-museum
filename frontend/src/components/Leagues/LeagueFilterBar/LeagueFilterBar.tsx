import React from 'react';

import styles from './LeagueFilterBar.module.css';

interface LeagueFilterBarProps {
	SearchInput: React.ReactNode;
}

const LeagueFilterBar: React.FC<LeagueFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>
		</div>
	);
};

export default LeagueFilterBar;
