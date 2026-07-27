import React from 'react';

import FilterField from '@/components/Stats/UI/FilterField';
import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';

type LocationValue = 'home' | 'away' | 'all';

type LocationFilterProps = {
	location: LocationValue;
	setLocation: (location: LocationValue) => void;
};

const locationOptions: { value: LocationValue; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'home', label: 'Home' },
	{ value: 'away', label: 'Away' }
];

const LocationFilter: React.FC<LocationFilterProps> = ({ location, setLocation }) => {
	return (
		<FilterField>
			<SegmentedToggle
				value={location}
				onValueChange={setLocation}
				options={locationOptions}
				ariaLabel="Home or away filter"
			/>
		</FilterField>
	);
};

export default LocationFilter;
