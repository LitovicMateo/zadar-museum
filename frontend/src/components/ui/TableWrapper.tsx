import React from 'react';

import styles from './TableWrapper.module.css';

const TableWrapper: React.FC<{ children: React.ReactNode; noOverflow?: boolean }> = ({ children, noOverflow }) => {
	return (
		<div className={noOverflow ? styles.wrapperNoOverflow : styles.wrapper}>
			<table className={styles.table}>{children}</table>
		</div>
	);
};

export default TableWrapper;
