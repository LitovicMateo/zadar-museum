import { Link } from 'react-router-dom';

import { type PodiumItem } from '@/components/UI/Podium';
import { cn } from '@/lib/Utils';

import { rankingsGrid } from './RankingsList';

type RankingsRowProps = {
	item: PodiumItem;
	rank: number;
};

const RankingsRow = ({ item, rank }: RankingsRowProps) => {
	const isTop = rank === 1;

	return (
		<li className={cn(rankingsGrid, 'border-t border-border py-2.5 transition-colors first:border-t-0 hover:bg-primary/5')}>
			<span className={cn('text-sm font-bold tabular-nums', isTop ? 'text-record' : 'text-muted-foreground')}>
				{rank}
			</span>
			<div className="flex min-w-0 items-center gap-2">
				{item.avatar && <span className="h-7 w-7 shrink-0">{item.avatar}</span>}
				<Link to={item.to} className="min-w-0 truncate font-medium text-foreground transition-colors hover:text-primary">
					{item.name}
				</Link>
			</div>
			<span className="text-right font-bold tabular-nums text-foreground">{item.value}</span>
		</li>
	);
};

export default RankingsRow;
