import React from 'react';

const TableWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<div className="w-fit shadow-md">
			<table className="font-abel text-sm">{children}</table>
		</div>
	);
};

export default TableWrapper;
