import React from 'react';
import { Search } from 'lucide-react';

import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { VenueLocation } from '@/types/api/Venue';

import styles from './VenueFilterBar.module.css';

const LOCATION_OPTIONS: { value: VenueLocation; label: string }[] = [
	{ value: 'home', label: 'Home' },
	{ value: 'away', label: 'Away' }
];

interface VenuesFilterBarProps {
	SearchInput: React.ReactNode;
	location: VenueLocation;
	onLocationChange: (value: VenueLocation) => void;
}

const VenueFilterBar: React.FC<VenuesFilterBarProps> = ({ SearchInput, location, onLocationChange }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>

			<SegmentedToggle
				value={location}
				onValueChange={onLocationChange}
				options={LOCATION_OPTIONS}
				ariaLabel="Venue location filter"
			/>
		</div>
	);
};

export default VenueFilterBar;
