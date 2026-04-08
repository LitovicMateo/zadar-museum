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
		<ul className={styles.list}>
			<li className={styles.header}>
				<span>#</span>
				<span>{nameLabel}</span>
				<span>Season</span>
				<span>Stat</span>
			</li>
			{records.map((record, index) => (
				<RecordsRow
					key={`${record.game_id}-${index}`}
					rank={index + 1}
					name={record.name}
					season={record.season}
					statValue={record.stat_value}
					gameId={record.game_id}
					isLast={index === records.length - 1}
				/>
			))}
		</ul>
	);
};

export default RecordsList;
