import React from 'react';

import FilterField from '@/components/Stats/UI/FilterField';
import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';

type Role = 'all' | 'head' | 'assistant';

type RoleFilterProps = {
	role: Role;
	setRole: (role: Role) => void;
};

const roleOptions: { value: Role; label: string }[] = [
	{ value: 'all', label: 'Total' },
	{ value: 'head', label: 'Head' },
	{ value: 'assistant', label: 'Assistant' }
];

const RoleFilter: React.FC<RoleFilterProps> = ({ role, setRole }) => {
	return (
		<FilterField>
			<SegmentedToggle value={role} onValueChange={setRole} options={roleOptions} ariaLabel="Coach role filter" />
		</FilterField>
	);
};

export default RoleFilter;
