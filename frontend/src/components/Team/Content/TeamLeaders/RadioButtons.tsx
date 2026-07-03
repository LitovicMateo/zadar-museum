import React from 'react';

import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';

type RadioButtonsProps = {
	selected: 'player' | 'coach';
	setSelected: React.Dispatch<React.SetStateAction<'player' | 'coach'>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, setSelected }) => {
	return (
		<SegmentedToggle
			value={selected}
			onValueChange={setSelected}
			ariaLabel="Leaders source"
			options={[
				{ value: 'player', label: 'Player' },
				{ value: 'coach', label: 'Coach' }
			]}
		/>
	);
};

export default RadioButtons;
