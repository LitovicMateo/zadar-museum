import React from 'react';

import { View } from '../coach-all-time-stats';
import CoachRoleSelector from '@/components/coach-page/shared/CoachRoleSelector';
import styles from './radio-buttons.module.css';

type RadioButtonsProps = { view: View; setView: React.Dispatch<React.SetStateAction<View>> };

const RadioButtons: React.FC<RadioButtonsProps> = ({ view, setView }) => {
	return (
		<CoachRoleSelector value={view as any} onChange={(v) => setView(v as View)} className={styles.fieldset} radioClassName={styles.option} title="View" />
	);
};

export default RadioButtons;
