import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const options = Object.entries(countries.getNames('en', { select: 'official' })).map(([code, name]) => ({
	value: code,
	label: name
}));

type CountrySelectProps = {
	onChange: (value: string) => void;
	selectedValue?: string | null;
};

const CountrySelect: React.FC<CountrySelectProps> = ({ onChange, selectedValue }) => {
	const selectedOption =
		selectedValue && selectedValue !== '' ? options.find((option) => option.value === selectedValue) : null;

	return (
		<Select
			options={options}
			onChange={(option) => onChange(option?.value.toString() || '')}
			value={selectedOption}
			placeholder="Select a country"
			styles={selectStyle()}
			isClearable
		/>
	);
};

export default CountrySelect;
