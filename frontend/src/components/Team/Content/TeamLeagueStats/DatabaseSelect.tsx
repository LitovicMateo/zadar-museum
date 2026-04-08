import React from 'react';

import Pill from '@/components/UI/Pill';

import styles from './DatabaseSelect.module.css';

type DatabaseSelectProps = {
	selected: 'total' | 'home' | 'away' | 'neutral';
	setSelected: React.Dispatch<React.SetStateAction<'total' | 'home' | 'away' | 'neutral'>>;
	neutralDisabled?: boolean;
};

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({ selected, setSelected, neutralDisabled }) => {
	return (
		<fieldset className={styles.fieldset}>
			<Pill label="total" isActive={selected === 'total'} onClick={() => setSelected('total')} />
			<Pill label="home" isActive={selected === 'home'} onClick={() => setSelected('home')} />
			<Pill label="away" isActive={selected === 'away'} onClick={() => setSelected('away')} />
			<Pill
				label="neutral"
				isActive={selected === 'neutral'}
				isDisabled={neutralDisabled}
				disabled={neutralDisabled}
				onClick={() => !neutralDisabled && setSelected('neutral')}
			/>
		</fieldset>
	);
};

export default DatabaseSelect;
