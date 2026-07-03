import React from 'react';
import { Search } from 'lucide-react';

import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/UI/Select';
import { type PositionFilter, type StatusFilter } from '@/hooks/UsePlayersFilters';

import styles from './PlayersFilterBar.module.css';

const POSITIONS = [
	{ value: 'all', label: 'All Positions' },
	{ value: 'pg', label: 'PG' },
	{ value: 'sg', label: 'SG' },
	{ value: 'sf', label: 'SF' },
	{ value: 'pf', label: 'PF' },
	{ value: 'c', label: 'C' }
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'active', label: 'Active' },
	{ value: 'retired', label: 'Retired' }
];

interface PlayersFilterBarProps {
	SearchInput: React.ReactNode;
	position: PositionFilter;
	onPositionChange: (value: PositionFilter) => void;
	status: StatusFilter;
	onStatusChange: (value: StatusFilter) => void;
}

const PlayersFilterBar: React.FC<PlayersFilterBarProps> = ({
	SearchInput,
	position,
	onPositionChange,
	status,
	onStatusChange
}) => {
	return (
		<div className={styles.filterBar}>
			<div className={styles.searchWrap}>
				<Search size={13} className={styles.searchIcon} aria-hidden />
				{SearchInput}
			</div>

			<div className={styles.filters}>
				<Select value={position} onValueChange={onPositionChange}>
					<SelectTrigger size="sm">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{POSITIONS.map((pos) => (
							<SelectItem key={pos.value} value={pos.value}>
								{pos.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<SegmentedToggle
					value={status}
					onValueChange={onStatusChange}
					options={STATUS_OPTIONS}
					ariaLabel="Player status filter"
				/>
			</div>
		</div>
	);
};

export default PlayersFilterBar;
