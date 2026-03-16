import RecordsRow from './RecordsRow';

import styles from './RecordsList.module.css';

type RecordItem = {
	game_id: string;
	name: string;
	season: string;
	stat_value: number;
};

type RecordsListProps = {
	records: RecordItem[];
	nameLabel: string;
};

const RecordsList = ({ records, nameLabel }: RecordsListProps) => {
	return (
		<div className={styles.card}>
			<ul className={styles.list}>
				<li className={styles.header}>
					<span>{nameLabel}</span>
					<span>Season</span>
					<span>Stat</span>
				</li>
				{records.map((record, index) => (
					<RecordsRow
						key={`${record.game_id}-${index}`}
						name={record.name}
						season={record.season}
						statValue={record.stat_value}
						gameId={record.game_id}
						isLast={index === records.length - 1}
					/>
				))}
			</ul>
		</div>
	);
};

export default RecordsList;
