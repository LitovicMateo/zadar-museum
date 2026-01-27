import React from 'react';

type TableCellProps = {
	children: React.ReactNode;
	sticky?: string;
};

const TableCell: React.FC<TableCellProps> = ({ children, sticky }) => {
	return (
		<td
			className={`px-4 py-3 whitespace-nowrap text-center font-normal border-t border-gray-200 hover:bg-gray-50 transition-colors ${sticky}`}
		>
			{children}
		</td>
	);
};

export default TableCell;
