import React from 'react';
import AppSelect from '@/components/forms/shared/AppSelect';

import FilterField from '@/components/Stats/UI/FilterField';
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
		<FilterField>
			<AppSelect
				styles={selectStyle('190px')}
				options={availableOptions}
				value={availableOptions.find((opt) => opt.value === value) ?? null}
				onChange={(opt) => onChange((opt?.value as string) ?? '')}
				isSearchable
				placeholder={placeholder ?? 'Select...'}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
				aria-label={label}
			/>
		</FilterField>
	);
};

export default EntityPicker;
