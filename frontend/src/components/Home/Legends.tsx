import React from 'react';
import { Link } from 'react-router-dom';

import { Skeleton } from '@/components/UI/Skeleton';
import { APP_ROUTES } from '@/constants/Routes';
import { usePlayerAllTimeStats } from '@/hooks/queries/stats/UsePlayerAllTimeStats';
import { cn } from '@/lib/Utils';
import { PlayerAllTimeStats } from '@/types/api/Player';
import { Crown } from 'lucide-react';

const TOP_N = 5;

// All-time franchise scoring leaders, read live from the same all-time stats endpoint
// the stats tables use (see UsePlayersDirectory.ts / UsePlayerStatsTable.tsx).
const useTopScorers = (): { players: PlayerAllTimeStats[]; isLoading: boolean } => {
	const { data, isLoading } = usePlayerAllTimeStats('main', 'total', 'all', 'all', 'all');
	const players = [...(data?.current ?? [])].sort((a, b) => b.points - a.points).slice(0, TOP_N);
	return { players, isLoading };
};

const rankStyles = (rank: number) =>
	rank === 1
		? 'bg-record text-record-foreground'
		: rank === 2
			? 'bg-[var(--medal-silver)] text-court'
			: rank === 3
				? 'bg-[var(--medal-bronze)] text-white'
				: 'bg-muted text-muted-foreground';

const Legends: React.FC = () => {
	const { players, isLoading } = useTopScorers();

	return (
		<section className="border-t bg-chalk">
			<div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
				<div className="flex items-center gap-2">
					<Crown size={18} className="text-record" />
					<h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
						Legende — najbolji strijelci svih vremena
					</h2>
				</div>

				<ol className="mt-5 grid gap-2 sm:gap-3">
					{isLoading
						? Array.from({ length: TOP_N }).map((_, i) => (
								<Skeleton key={i} className="h-14 w-full rounded-xl" />
							))
						: players.map((player, i) => {
								const rank = i + 1;
								return (
									<li key={player.player_id}>
										<Link
											to={APP_ROUTES.player(player.player_id)}
											className="flex items-center gap-4 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-court"
										>
											<span
												className={cn(
													'flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold',
													rankStyles(rank)
												)}
											>
												{rank}
											</span>
											<span className="min-w-0 flex-1 truncate font-medium">
												{player.first_name} {player.last_name}
											</span>
											<span className="shrink-0 text-right">
												<span className="font-display text-lg font-bold tabular-nums">
													{player.points.toLocaleString('hr-HR')}
												</span>
												<span className="ml-1 font-mono text-[0.65rem] uppercase tracking-wider text-muted-foreground">
													poena
												</span>
											</span>
										</Link>
									</li>
								);
							})}
				</ol>
			</div>
		</section>
	);
};

export default Legends;
