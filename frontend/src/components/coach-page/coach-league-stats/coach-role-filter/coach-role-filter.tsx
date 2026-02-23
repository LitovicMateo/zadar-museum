import React from 'react';
import CoachRoleSelector from '../../shared/CoachRoleSelector';
import styles from './coach-role-filter.module.css';

type CoachRoleFilterProps = {
	setCoachRole: (role: 'total' | 'headCoach' | 'assistantCoach') => void;
	coachRole: 'total' | 'headCoach' | 'assistantCoach';
};

const CoachRoleFilter: React.FC<CoachRoleFilterProps> = ({ coachRole, setCoachRole }) => {
	return (
		<CoachRoleSelector value={coachRole} onChange={setCoachRole} className={styles.fieldset} radioClassName={styles.option} />
	);
};

export default CoachRoleFilter;
