import React from 'react';
import Select from 'react-select';

import Category from '@/components/Stats/Category';
import Container from '@/components/Stats/Container';
import { selectStyle } from '@/constants/ReactSelectStyle';

type LocationValue = 'home' | 'away' | 'all';

type LocationFilterProps = {
	location: LocationValue;
	setLocation: (location: LocationValue) => void;
};

const locationOptions: { label: string; value: LocationValue }[] = [
	{ label: 'All', value: 'all' },
	{ label: 'Home', value: 'home' },
	{ label: 'Away', value: 'away' }
];

const LocationFilter: React.FC<LocationFilterProps> = ({ location, setLocation }) => {
	return (
		<Container>
			<Category>Home / Away</Category>
			<Select
				styles={selectStyle()}
				value={locationOptions.find((opt) => opt.value === location)}
				onChange={(opt) => setLocation((opt?.value as LocationValue) ?? 'all')}
				options={locationOptions}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</Container>
	);
};

export default LocationFilter;
