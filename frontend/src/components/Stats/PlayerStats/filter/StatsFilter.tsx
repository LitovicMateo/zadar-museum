import React from 'react';

import FilterField from '@/components/Stats/UI/FilterField';
import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';

type StatScope = 'total' | 'average';

type StatsFilterProps = {
	stats?: StatScope;
	setStats?: (stats: StatScope) => void;
};

const statsOptions: { value: StatScope; label: string }[] = [
	{ value: 'total', label: 'Total' },
	{ value: 'average', label: 'Average' }
];

const StatsFilter: React.FC<StatsFilterProps> = ({ stats = 'total', setStats }) => {
	return (
		<FilterField>
			<SegmentedToggle
				value={stats}
				onValueChange={(v) => setStats?.(v)}
				options={statsOptions}
				ariaLabel="Total or average filter"
			/>
		</FilterField>
	);
};

export default StatsFilter;
