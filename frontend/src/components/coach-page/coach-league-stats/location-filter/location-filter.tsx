import React from 'react';
import LocationSelector from '../../shared/LocationSelector';
import styles from './location-filter.module.css';

type LocationFilterProps = {
	location: 'total' | 'home' | 'away' | 'neutral';
	setLocation: (location: 'total' | 'home' | 'away' | 'neutral') => void;
	hasNeutral: boolean;
};

const LocationFilter: React.FC<LocationFilterProps> = ({ location, setLocation, hasNeutral }) => {
	return (
		<LocationSelector value={location} onChange={setLocation} hasNeutral={hasNeutral} className={styles.fieldset} radioClassName={styles.option} inputClassName={styles.inputRounded} />
	);
};

export default LocationFilter;
