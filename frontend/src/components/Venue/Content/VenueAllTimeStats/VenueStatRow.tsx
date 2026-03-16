import React from 'react';
import styles from './VenueStatRow.module.css';

type Props = {
	label: React.ReactNode;
	value: React.ReactNode;
	header?: boolean;
};

const VenueStatRow: React.FC<Props> = ({ label, value, header = false }) => {
	if (header) {
		return (
			<li className={styles.header}>
				<div className={styles.headerInner}>
					<span>{label}</span>
					<span>{value}</span>
				</div>
			</li>
		);
	}

	return (
		<li>
			<div className={styles.rowInner}>
				<div className={styles.label}>{label}</div>
				<div className={styles.value}>{value}</div>
			</div>
		</li>
	);
};

export default VenueStatRow;
