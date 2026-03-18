import { type ReactNode } from 'react';

import styles from './RecordsCard.module.css';

type RecordsCardProps = {
	children: ReactNode;
};

const RecordsCard = ({ children }: RecordsCardProps) => {
	return <div className={styles.card}>{children}</div>;
};

export default RecordsCard;
