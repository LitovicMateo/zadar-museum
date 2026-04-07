import React from 'react';

import styles from './NoData.module.css';

const NoData: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<div className={styles.noData}>
			<p>{children || 'No data available.'}</p>
		</div>
	);
};

export default NoData;
