import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';

import Category from '../../../pages/Stats/Category';
import Container from '../../../pages/Stats/Container';

type LocationFilterProps = {
	location: 'home' | 'away' | null;
	setLocation: (location: 'home' | 'away' | null) => void;
};

const locationOptions: { label: string; value: string }[] = [
	{
		label: 'All',
		value: ''
	},
	{
		label: 'Home',
		value: 'home'
	},
	{
		label: 'Away',
		value: 'away'
	}
];

const LocationFilter: React.FC<LocationFilterProps> = ({ location, setLocation }) => {
	return (
		<Container>
			<Category>Home / Away</Category>
			<Select
				styles={selectStyle()}
				value={locationOptions.find((opt) => opt.value === location)}
				onChange={(opt) => setLocation((opt?.value as 'home' | 'away' | null) ?? null)}
				options={locationOptions}
			/>
		</Container>
	);
};

export default LocationFilter;
