import React from 'react';

import RadioGroup from '@/components/ui/RadioGroup';

import Radio from '../../ui/Radio';

import styles from './CoachFilterBar.module.css';

export type CoachRole = 'total' | 'headCoach' | 'assistantCoach';
export type MatchLocation = 'total' | 'home' | 'away' | 'neutral';

type Props = {
	coachRole: CoachRole;
	setCoachRole: (r: CoachRole) => void;
	location: MatchLocation;
	setLocation: (l: MatchLocation) => void;
	hasNeutral: boolean;
	className?: string;
};

const CoachFilterBar: React.FC<Props> = ({ coachRole, setCoachRole, location, setLocation, hasNeutral, className }) => {
	return (
		<div className={`${styles.filtersRow} ${className ?? ''} ${styles.fontAbel}`.trim()}>
			<RadioGroup>
				<Radio label="Total" onChange={() => setCoachRole('total')} isActive={coachRole === 'total'} />
				<Radio
					label="Head Coach"
					isActive={coachRole === 'headCoach'}
					onChange={() => setCoachRole('headCoach')}
				/>
				<Radio
					label="Assistant Coach"
					isActive={coachRole === 'assistantCoach'}
					onChange={() => setCoachRole('assistantCoach')}
				/>
			</RadioGroup>
			<RadioGroup>
				<Radio label="Total" onChange={() => setLocation('total')} isActive={location === 'total'} />
				<Radio label="Home" onChange={() => setLocation('home')} isActive={location === 'home'} />
				<Radio label="Away" onChange={() => setLocation('away')} isActive={location === 'away'} />
				<Radio
					label="Neutral"
					onChange={() => setLocation('neutral')}
					isActive={location === 'neutral'}
					isDisabled={!hasNeutral}
				/>
			</RadioGroup>
		</div>
	);
};

export default CoachFilterBar;
