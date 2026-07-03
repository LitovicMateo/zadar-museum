import React from 'react';
import { Search } from 'lucide-react';

import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { RoleFilter } from '@/hooks/useCoachesFilters';

import styles from './CoachesFilterBar.module.css';

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'head', label: 'Head' },
	{ value: 'assistant', label: 'Assistant' }
];

interface CoachesFilterBarProps {
	SearchInput: React.ReactNode;
	role: RoleFilter;
	onRoleChange: (value: RoleFilter) => void;
}

const CoachesFilterBar: React.FC<CoachesFilterBarProps> = ({ SearchInput, role, onRoleChange }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>

			<div className={styles.filters}>
				<SegmentedToggle
					value={role}
					onValueChange={onRoleChange}
					options={ROLE_OPTIONS}
					ariaLabel="Coach role filter"
				/>
			</div>
		</div>
	);
};

export default CoachesFilterBar;
