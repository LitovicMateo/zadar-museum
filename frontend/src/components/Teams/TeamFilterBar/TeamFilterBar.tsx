import React from 'react';
import { Search } from 'lucide-react';

import styles from './TeamFilterBar.module.css';

interface TeamsFilterBarProps {
	SearchInput: React.ReactNode;
}

const TeamFilterBar: React.FC<TeamsFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>
		</div>
	);
};

export default TeamFilterBar;
