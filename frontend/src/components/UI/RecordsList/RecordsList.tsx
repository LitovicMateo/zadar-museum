import { type ReactNode } from 'react';

import RecordsRow from './RecordsRow';

export type RecordItem = {
	game_id: string;
	name: string;
	season: string;
	stat_value: number;
	avatar?: ReactNode;
};

type RecordsListProps = {
	records: RecordItem[];
	nameLabel: string;
	startRank?: number;
	showHeader?: boolean;
};

export const recordsGrid = 'grid grid-cols-[2rem_1fr_auto_auto] items-center gap-3 px-4';

const RecordsList = ({ records, nameLabel, startRank = 1, showHeader = true }: RecordsListProps) => {
	return (
		<ul className="m-0 list-none p-0">
			{showHeader && (
				<li
					className={`${recordsGrid} border-b border-border bg-muted py-2.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.08em] text-muted-foreground`}
				>
					<span>#</span>
					<span>{nameLabel}</span>
					<span className="text-right">Season</span>
					<span className="text-right">Stat</span>
				</li>
			)}
			{records.map((record, index) => (
				<RecordsRow
					key={`${record.game_id}-${index}`}
					rank={startRank + index}
					name={record.name}
					season={record.season}
					statValue={record.stat_value}
					gameId={record.game_id}
					avatar={record.avatar}
				/>
			))}
		</ul>
	);
};

export default RecordsList;
