import { type PodiumItem } from '@/components/UI/Podium';

import RankingsRow from './RankingsRow';

type RankingsListProps = {
	items: PodiumItem[];
	startRank?: number;
};

export const rankingsGrid = 'grid grid-cols-[2rem_1fr_auto] items-center gap-3 px-4';

const RankingsList = ({ items, startRank = 1 }: RankingsListProps) => {
	return (
		<div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
			<ul className="m-0 list-none p-0">
				{items.map((item, index) => (
					<RankingsRow key={item.id} item={item} rank={startRank + index} />
				))}
			</ul>
		</div>
	);
};

export default RankingsList;
