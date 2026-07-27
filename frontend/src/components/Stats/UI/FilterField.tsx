import React from 'react';

type FilterFieldProps = {
	children: React.ReactNode;
};

/**
 * Layout wrapper for a single control in the stats filter bar. Reads cleanly
 * both inline (desktop bar) and stacked (mobile sheet).
 */
const FilterField: React.FC<FilterFieldProps> = ({ children }) => {
	return <div className="flex flex-col gap-1">{children}</div>;
};

export default FilterField;
