import React, { useState } from 'react';

import StatsPageHeader from '@/components/Stats/UI/StatsPageHeader';
import SegmentedToggle from '@/components/UI/SegmentedToggle/SegmentedToggle';

import CoachCompare from './CoachCompare';
import PlayerCompare from './PlayerCompare';

type Entity = 'player' | 'coach';

const ENTITY_OPTIONS: { value: Entity; label: string }[] = [
	{ value: 'player', label: 'Players' },
	{ value: 'coach', label: 'Coaches' }
];

const ComparePage: React.FC = () => {
	const [entity, setEntity] = useState<Entity>('player');

	// Rendered inline at the start of the compare filter bar so the entity switch
	// shares a row with the filters instead of sitting alone above them.
	const entityToggle = (
		<SegmentedToggle
			value={entity}
			onValueChange={setEntity}
			options={ENTITY_OPTIONS}
			ariaLabel="Compare entity type"
		/>
	);

	return (
		<div className="w-full">
			<StatsPageHeader title="Compare" />

			{entity === 'player' ? (
				<PlayerCompare leading={entityToggle} />
			) : (
				<CoachCompare leading={entityToggle} />
			)}
		</div>
	);
};

export default ComparePage;
