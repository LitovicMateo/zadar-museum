import React from 'react';

import Pill from '@/components/ui/Pill';

import styles from './DatabaseSelect.module.css';

type DatabaseSelectProps = {
	selected: 'total' | 'home' | 'away' | 'neutral';
	setSelected: React.Dispatch<React.SetStateAction<'total' | 'home' | 'away' | 'neutral'>>;
};

const DatabaseSelect: React.FC<DatabaseSelectProps> = ({ selected, setSelected }) => {
	return (
		<fieldset className={styles.fieldset}>
			<Pill label="total" isActive={selected === 'total'} onClick={() => setSelected('total')} />
			<Pill label="home" isActive={selected === 'home'} onClick={() => setSelected('home')} />
			<Pill label="away" isActive={selected === 'away'} onClick={() => setSelected('away')} />
			<Pill label="neutral" isActive={selected === 'neutral'} onClick={() => setSelected('neutral')} />
		</fieldset>
	);
};

export default DatabaseSelect;
