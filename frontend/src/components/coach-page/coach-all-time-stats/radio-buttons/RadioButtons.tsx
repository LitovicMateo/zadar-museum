import React from 'react';

import { View } from '../CoachAllTimeStats';
import CoachRoleSelector from '@/components/coach-page/shared/CoachRoleSelector';
import styles from './RadioButtons.module.css';

type RadioButtonsProps = { view: View; setView: React.Dispatch<React.SetStateAction<View>> };

const RadioButtons: React.FC<RadioButtonsProps> = ({ view, setView }) => {
	return (
		<CoachRoleSelector value={view as any} onChange={(v) => setView(v as View)} className={styles.fieldset} radioClassName={styles.option} title="View" />
	);
};

export default RadioButtons;
