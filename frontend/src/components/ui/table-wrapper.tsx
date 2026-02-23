import React from 'react';

import styles from './table-wrapper.module.css';

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className={styles.wrapper}>
			<table className={styles.table}>{children}</table>
		</div>
	);
};

export default TableWrapper;
