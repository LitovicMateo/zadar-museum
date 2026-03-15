import React from 'react';

import Pill from '@/components/ui/Pill';

import styles from './RadioButtons.module.css';

type RadioButtonsProps = {
	selected: 'player' | 'coach';
	setSelected: React.Dispatch<React.SetStateAction<'player' | 'coach'>>;
};

const RadioButtons: React.FC<RadioButtonsProps> = ({ selected, setSelected }) => {
	return (
		<fieldset className={styles.fieldset}>
			<Pill label="Player" isActive={selected === 'player'} onClick={() => setSelected('player')} />
			<Pill label="Coach" isActive={selected === 'coach'} onClick={() => setSelected('coach')} />
		</fieldset>
	);
};

export default RadioButtons;
