import React from 'react';
import { Search } from 'lucide-react';

import styles from './LeagueFilterBar.module.css';

interface LeagueFilterBarProps {
	SearchInput: React.ReactNode;
}

const LeagueFilterBar: React.FC<LeagueFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>
		</div>
	);
};

export default LeagueFilterBar;
