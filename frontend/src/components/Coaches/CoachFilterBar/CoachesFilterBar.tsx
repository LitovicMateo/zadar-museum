import React from 'react';

import Pill from '@/components/ui/Pill/Pill';
import { RoleFilter } from '@/hooks/useCoachesFilters';

import styles from './CoachesFilterBar.module.css';

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'head', label: 'Head Coach' },
	{ value: 'assistant', label: 'Assistant Coach' }
];

interface CoachesFilterBarProps {
	SearchInput: React.ReactNode;
	role: RoleFilter;
	onRoleChange: (value: RoleFilter) => void;
}

const CoachesFilterBar: React.FC<CoachesFilterBarProps> = ({ SearchInput, role, onRoleChange }) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>{SearchInput}</div>

			<div className={styles.filters}>
				<div className={styles.statusGroup} role="radiogroup" aria-label="Coach role filter">
					{ROLE_OPTIONS.map((opt) => (
						<Pill
							key={opt.value}
							label={opt.label}
							isActive={role === opt.value}
							onClick={() => onRoleChange(opt.value)}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default CoachesFilterBar;
