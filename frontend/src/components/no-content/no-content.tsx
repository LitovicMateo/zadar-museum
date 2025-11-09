import React from 'react';

const NoContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<div className="text-center w-full py-4 text-lg flex flex-col gap-2 justify-center items-center font-abel text-gray-500">
			{children}
		</div>
	);
};

export default NoContent;
