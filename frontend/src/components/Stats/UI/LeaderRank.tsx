import React from 'react';
import { Crown } from 'lucide-react';

import { cn } from '@/lib/Utils';

type LeaderRankProps = {
	rank: number;
	/** Season-over-season movement: negative = climbed, positive = dropped. */
	delta?: number;
};

/**
 * Rank cell for the /stats leaderboards. The #1 record-holder is marked in
 * record-gold with a crown (gold is reserved for #1); an optional delta shows
 * season-over-season movement.
 */
const LeaderRank: React.FC<LeaderRankProps> = ({ rank, delta = 0 }) => {
	const isTop = rank === 1;

	let arrow = '';
	let color = '';
	if (delta < 0) {
		arrow = '▲';
		color = 'text-green-600';
	} else if (delta > 0) {
		arrow = '▼';
		color = 'text-red-600';
	}

	return (
		<div className="grid grid-cols-[3ch_5ch] items-center justify-center gap-1">
			<span className={cn('inline-flex items-center justify-center gap-0.5', isTop && 'font-bold text-record')}>
				{isTop && <Crown size={11} className="shrink-0 text-record" aria-hidden />}
				{rank}
			</span>
			{delta !== 0 && (
				<span className={cn('text-xs', color)}>
					{arrow} {Math.abs(delta)}
				</span>
			)}
		</div>
	);
};

export default LeaderRank;
