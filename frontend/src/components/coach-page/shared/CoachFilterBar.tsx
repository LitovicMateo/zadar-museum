import React from 'react';
import CoachRoleSelector from './CoachRoleSelector';
import LocationSelector from './LocationSelector';
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
      <CoachRoleSelector value={coachRole} onChange={setCoachRole} radioClassName={styles.option} />
      <LocationSelector value={location} onChange={setLocation} hasNeutral={hasNeutral} radioClassName={styles.option} inputClassName={styles.inputRounded} />
    </div>
  );
};

export default CoachFilterBar;
