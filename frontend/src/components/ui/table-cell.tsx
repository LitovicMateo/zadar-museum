import React from 'react';

type TableCellProps = {
	children: React.ReactNode;
	sticky?: string;
};

const TableCell: React.FC<TableCellProps> = ({ children, sticky }) => {
	return (
		<td className={`px-4 py-2 whitespace-nowrap text-center font-normal border-t border-slate-400 ${sticky}`}>
			{children}
		</td>
	);
};

export default TableCell;
