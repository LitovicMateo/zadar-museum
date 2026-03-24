import React from 'react';

import styles from './VenueFilterBar.module.css';

interface VenuesFilterBarProps {
	SearchInput: React.ReactNode;
}

const VenueFilterBar: React.FC<VenuesFilterBarProps> = ({ SearchInput }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>
		</div>
	);
};

export default VenueFilterBar;
