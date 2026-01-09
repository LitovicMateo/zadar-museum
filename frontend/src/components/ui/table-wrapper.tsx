import React from 'react';

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="overflow-x-auto pb-4 w-fit max-w-full rounded-md">
			<table className="font-abel text-md">{children}</table>
		</div>
	);
};

export default TableWrapper;
