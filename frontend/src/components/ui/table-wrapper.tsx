import React from 'react';

const TableWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<div className="overflow-x-auto w-fit max-w-full rounded-lg shadow-lg border border-gray-200 bg-white">
			<table className="font-abel text-md w-full">{children}</table>
		</div>
	);
};

export default TableWrapper;
