import React from 'react';
import { cn } from '@/lib/Utils';
import styles from './TableCell.module.css';

type TableCellProps = {
	children: React.ReactNode;
	sticky?: string;
};

const TableCell: React.FC<TableCellProps> = ({ children, sticky }) => {
	return (
		<td className={cn(styles.cell, sticky)}>
			{children}
		</td>
	);
};

export default TableCell;
