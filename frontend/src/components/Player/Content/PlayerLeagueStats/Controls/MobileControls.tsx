import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';

import styles from './MobileControls.module.css';

interface MobileControlsProps {
	view: 'total' | 'average';
	location: 'total' | 'home' | 'away' | 'neutral';
	hasNeutral: boolean;
	setView: (view: 'total' | 'average') => void;
	setLocation: (location: 'total' | 'home' | 'away' | 'neutral') => void;
}

function MobileControls({ view, location, hasNeutral, setView, setLocation }: MobileControlsProps) {
	const viewOptions = [
		{ value: 'total', label: 'Total' },
		{ value: 'average', label: 'Average' }
	];

	const locationOptions = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home' },
		{ value: 'away', label: 'Away' },
		{ value: 'neutral', label: 'Neutral' }
	];
	return (
		<div className={styles.mobileControls}>
			<Select
				value={viewOptions.find((o) => o.value === view)}
				options={viewOptions}
				onChange={(opt) => opt && setView(opt.value as 'total' | 'average')}
				styles={selectStyle()}
				isSearchable={false}
				aria-label="View"
			/>
			<Select
				value={locationOptions.find((o) => o.value === location)}
				options={locationOptions.filter((o) => o.value !== 'neutral' || hasNeutral)}
				onChange={(opt) => opt && setLocation(opt.value as 'total' | 'home' | 'away' | 'neutral')}
				styles={selectStyle()}
				isSearchable={false}
				aria-label="Location"
			/>
		</div>
	);
}

export default MobileControls;
