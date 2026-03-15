import React from 'react';

import styles from './StatBox.module.css';

type StatBoxProps = {
	label: string;
	stat: number;
	rank?: number;
};
const StatBox: React.FC<StatBoxProps> = ({ label, rank, stat }) => {
	return (
		<div className={styles.card}>
			<div className={styles.value}>{stat}</div>
			<div className={styles.label}>
				<span className={styles.labelText}>{label}</span>
			</div>
			{rank && (
				<div className={styles.rankBadge}>
					<span>{rank}</span>
				</div>
			)}
		</div>
	);
};

export default StatBox;
