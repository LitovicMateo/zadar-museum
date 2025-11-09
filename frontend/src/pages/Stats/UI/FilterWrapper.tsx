import React from 'react';

const FilterWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return <div className="mb-4 grid grid-cols-2 sm:flex items-start w-fit gap-4">{children}</div>;
};

export default FilterWrapper;
