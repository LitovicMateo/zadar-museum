import React from 'react';

import { cn } from '@/lib/Utils';

import styles from './TableWrapper.module.css';

const TableWrapper: React.FC<{ children: React.ReactNode; noOverflow?: boolean; className?: string }> = ({
	children,
	noOverflow,
	className
}) => {
	return (
		<div className={noOverflow ? styles.wrapperNoOverflow : styles.wrapper}>
			<table className={cn(styles.table, className)}>{children}</table>
		</div>
	);
};

export default TableWrapper;
