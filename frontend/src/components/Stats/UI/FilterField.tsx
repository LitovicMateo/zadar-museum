import React from 'react';

type FilterFieldProps = {
	label: string;
	children: React.ReactNode;
};

/**
 * Labelled wrapper for a single control in the stats filter bar — a mono
 * uppercase caption above the control. Replaces the old Container + Category
 * pair and reads cleanly both inline (desktop bar) and stacked (mobile sheet).
 */
const FilterField: React.FC<FilterFieldProps> = ({ label, children }) => {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-mono text-[0.6rem] font-medium uppercase tracking-[0.08em] text-muted-foreground">
				{label}
			</span>
			{children}
		</div>
	);
};

export default FilterField;
