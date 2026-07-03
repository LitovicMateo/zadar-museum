import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { cn } from '@/lib/Utils';

import { recordsGrid } from './RecordsList';

type RecordsRowProps = {
	rank: number;
	name: string;
	season: string;
	statValue: number;
	gameId: string;
	avatar?: ReactNode;
};

const RecordsRow = ({ rank, name, season, statValue, gameId, avatar }: RecordsRowProps) => {
	const isTop = rank === 1;
	return (
		<li className={cn(recordsGrid, 'border-t border-border py-2.5 transition-colors first:border-t-0 hover:bg-primary/5')}>
			<span className={cn('text-sm font-bold tabular-nums', isTop ? 'text-record' : 'text-muted-foreground')}>
				{rank}
			</span>
			<div className="flex min-w-0 items-center gap-2">
				{avatar && <span className="h-7 w-7 shrink-0">{avatar}</span>}
				<Link
					to={APP_ROUTES.game(gameId)}
					className="min-w-0 truncate font-medium text-foreground transition-colors hover:text-primary"
				>
					{name}
				</Link>
			</div>
			<span className="text-right text-sm tabular-nums text-muted-foreground">{season}</span>
			<span className="text-right font-bold tabular-nums text-foreground">{statValue}</span>
		</li>
	);
};

export default RecordsRow;
