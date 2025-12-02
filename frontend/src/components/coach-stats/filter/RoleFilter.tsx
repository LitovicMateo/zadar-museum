import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import Category from '@/pages/Stats/Category';
import Container from '@/pages/Stats/Container';

type Option = {
	value: 'all' | 'head' | 'assistant';
	label: string;
};

type RoleFilterProps = {
	role: 'all' | 'head' | 'assistant';
	setRole: (role: 'all' | 'head' | 'assistant') => void;
};

const roleOptions: Option[] = [
	{ value: 'all', label: 'Total' },
	{ value: 'head', label: 'Head' },
	{ value: 'assistant', label: 'Assistant' }
];

const RoleFilter: React.FC<RoleFilterProps> = ({ role, setRole }) => {
	return (
		<Container>
			<Category>Role</Category>
			<Select
				styles={selectStyle()}
				value={roleOptions.find((opt) => opt.value === role)}
				onChange={(opt) => setRole((opt?.value as 'all' | 'head' | 'assistant') ?? 'all')}
				options={roleOptions}
			/>
		</Container>
	);
};

export default RoleFilter;
