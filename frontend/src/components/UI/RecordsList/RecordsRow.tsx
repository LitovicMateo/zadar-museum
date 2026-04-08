import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';

import styles from './RecordsRow.module.css';

type RecordsRowProps = {
	rank: number;
	name: string;
	season: string;
	statValue: number;
	gameId: string;
	isLast: boolean;
};

const RecordsRow = ({ rank, name, season, statValue, gameId, isLast }: RecordsRowProps) => {
	return (
		<li className={`${styles.item} ${isLast ? '' : styles.itemBorder}`}>
			<span className={styles.rank}>{rank}</span>
			<Link to={APP_ROUTES.game(gameId)} className={styles.link}>
				{name}
			</Link>
			<span className={styles.season}>{season}</span>
			<span className={styles.value}>{statValue}</span>
		</li>
	);
};

export default RecordsRow;
