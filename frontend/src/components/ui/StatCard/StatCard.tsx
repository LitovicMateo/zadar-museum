import React from 'react';
import { cn } from '@/lib/Utils';
import styles from './StatCard.module.css';

interface StatCardProps {
	label: string;
	value: number | string;
	rank?: number;
	className?: string;
	showBorder?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, rank, className, showBorder = true }) => {
	return (
		<div className={cn(styles.card, showBorder && styles.withBorder, className)}>
			<div className={styles.label}>{label}</div>
			<div className={styles.valueGroup}>
				<span className={styles.value}>{value}</span>
				{rank !== undefined && <span className={styles.rank}>#{rank}</span>}
			</div>
		</div>
	);
};

export default StatCard;
