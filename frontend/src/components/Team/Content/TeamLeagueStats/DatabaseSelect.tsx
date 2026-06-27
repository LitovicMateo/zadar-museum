import React from 'react';

import Pill from '@/components/UI/Pill';

import styles from './DatabaseSelect.module.css';

type DatabaseSelectProps = {
	selected: 'total' | 'home' | 'away' | 'neutral';
	setSelected: React.Dispatch<React.SetStateAction<'total' | 'home' | 'away' | 'neutral'>>;
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
	return (
		<fieldset className={styles.fieldset}>
			<Pill label="total" isActive={selected === 'total'} onClick={() => setSelected('total')} />
			<Pill
				label="home"
				isActive={selected === 'home'}
				isDisabled={homeDisabled}
				disabled={homeDisabled}
				onClick={() => !homeDisabled && setSelected('home')}
			/>
			<Pill
				label="away"
				isActive={selected === 'away'}
				isDisabled={awayDisabled}
				disabled={awayDisabled}
				onClick={() => !awayDisabled && setSelected('away')}
			/>
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
