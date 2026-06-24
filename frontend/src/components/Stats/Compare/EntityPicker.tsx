import React from 'react';
import Select from 'react-select';

import Category from '@/components/Stats/Category';
import Container from '@/components/Stats/Container';
import { selectStyle } from '@/constants/ReactSelectStyle';

type Option = { value: string; label: string };

type EntityPickerProps = {
	label: string;
	options: Option[];
	value: string;
	onChange: (value: string) => void;
	excludeValue?: string;
	placeholder?: string;
};

const EntityPicker: React.FC<EntityPickerProps> = ({ label, options, value, onChange, excludeValue, placeholder }) => {
	const availableOptions = excludeValue ? options.filter((opt) => opt.value !== excludeValue) : options;

	return (
		<Container>
			<Category>{label}</Category>
			<Select
				styles={selectStyle()}
				options={availableOptions}
				value={availableOptions.find((opt) => opt.value === value) ?? null}
				onChange={(opt) => onChange((opt?.value as string) ?? '')}
				isSearchable
				placeholder={placeholder ?? 'Select...'}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</Container>
	);
};

export default EntityPicker;
