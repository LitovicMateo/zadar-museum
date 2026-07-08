import React from 'react';

import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';

type Location = 'total' | 'home' | 'away' | 'neutral';

type DatabaseSelectProps = {
	selected: Location;
	setSelected: React.Dispatch<React.SetStateAction<Location>>;
	homeDisabled?: boolean;
	awayDisabled?: boolean;
	neutralDisabled?: boolean;
};

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({
	selected,
	setSelected,
	homeDisabled,
	awayDisabled,
	neutralDisabled
}) => {
	const options: SegmentedOption<Location>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home', disabled: homeDisabled },
		{ value: 'away', label: 'Away', disabled: awayDisabled },
		{ value: 'neutral', label: 'Neutral', disabled: neutralDisabled }
	];

	return (
		<SegmentedToggle
			value={selected}
			onValueChange={setSelected}
			options={options}
			ariaLabel="Location filter"
			itemClassName="border border-court data-[state=on]:border-transparent"
		/>
	);
};

export default DatabaseSelect;
