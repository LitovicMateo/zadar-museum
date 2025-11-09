import React from 'react';

const Category: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return (
		<div className="px-2 h-6 text-xs uppercase whitespace-nowrap flex justify-center items-center border-1 border-gray-200 border-solid bg-gray-50 rounded-sm ">
			{children}
		</div>
	);
};

export default Category;
