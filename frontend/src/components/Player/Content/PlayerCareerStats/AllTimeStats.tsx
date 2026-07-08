import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { Skeleton } from '@/components/UI/Skeleton';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/UseAllTimeStats';
import { cn } from '@/lib/Utils';
import { GameStats } from '@/types/api/Player';
import { usePlayerHasAppearances } from '@/utils/PlayerHasAppearances';
import { Crown } from 'lucide-react';

type StatKey = keyof GameStats;
type LocationValue = 'total' | 'home' | 'away' | 'neutral';

const SECONDARY_STATS: { label: string; key: StatKey; rankKey: StatKey }[] = [
	{ label: 'Games', key: 'games', rankKey: 'games_rank' },
	{ label: 'Rebounds', key: 'rebounds', rankKey: 'rebounds_rank' },
	{ label: 'Assists', key: 'assists', rankKey: 'assists_rank' },
	{ label: '3PT Made', key: 'three_pointers_made', rankKey: 'three_pointers_made_rank' },
	{ label: 'FT Made', key: 'free_throws_made', rankKey: 'free_throws_made_rank' }
];

const SHOOTING_SPLITS: { label: string; pct: StatKey; made: StatKey; att: StatKey }[] = [
	{ label: 'FG', pct: 'field_goal_percentage', made: 'field_goals_made', att: 'field_goals_attempted' },
	{ label: '3PT', pct: 'three_point_percentage', made: 'three_pointers_made', att: 'three_pointers_attempted' },
	{ label: 'FT', pct: 'free_throw_percentage', made: 'free_throws_made', att: 'free_throws_attempted' }
];

const fmt = (v: number | null | undefined): string => (v == null ? '–' : `${v}`);

const RankBadge: React.FC<{ rank: number | null | undefined }> = ({ rank }) => {
	if (rank == null) return null;
	if (rank === 1) {
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-record px-2 py-0.5 font-mono text-[0.65rem] font-semibold text-record-foreground">
				<Crown size={11} /> #1
			</span>
		);
	}
	return (
		<span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[0.65rem] font-medium text-muted-foreground">
			#{rank}
		</span>
	);
};

const ShootingBar: React.FC<{ label: string; pct: number | null; made: number | null; att: number | null }> = ({
	label,
	pct,
	made,
	att
}) => (
	<div>
		<div className="flex items-baseline justify-between">
			<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
				{label}
			</span>
			<span className="font-semibold tabular-nums text-foreground">{pct == null ? '–' : `${pct}%`}</span>
		</div>
		<div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
			<div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(pct ?? 0, 100)}%` }} />
		</div>
		<p className="mt-1 font-mono text-[0.65rem] tabular-nums text-muted-foreground">
			{fmt(made)} / {fmt(att)}
		</p>
	</div>
);

const AllTimeStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data, isLoading } = useAllTimeStats(playerId!, selectedDatabase!);
	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase!);

	const [location, setLocation] = useState<LocationValue>('total');
	const hasHome = !!data?.[0]?.total?.home?.games;
	const hasAway = !!data?.[0]?.total?.away?.games;
	const hasNeutral = !!data?.[0]?.total?.neutral?.games;

	useEffect(() => {
		if (location === 'home' && !hasHome) setLocation('total');
		else if (location === 'away' && !hasAway) setLocation('total');
		else if (location === 'neutral' && !hasNeutral) setLocation('total');
	}, [hasHome, hasAway, hasNeutral, location]);

	if (isLoading || !data) return <CareerSkeleton />;
	if (!hasAppearances) return null;

	const stats = data[0].total[location] ?? data[0].total.total;
	if (!stats) return null;

	const locations: SegmentedOption<LocationValue>[] = [
		{ value: 'total', label: 'Total' },
		{ value: 'home', label: 'Home', disabled: !hasHome },
		{ value: 'away', label: 'Away', disabled: !hasAway },
		{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
	];

	const pointsRankOne = stats.points_rank === 1;

	return (
		<section className="space-y-6">
			<MobileFilterSheet title="Filter stats">
				<SegmentedToggle
					value={location}
					onValueChange={setLocation}
					options={locations}
					ariaLabel="Location filter"
					itemClassName="border border-court data-[state=on]:border-transparent"
				/>
			</MobileFilterSheet>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{/* Featured: Points */}
				<div
					className={cn(
						'relative flex flex-col justify-between gap-4 rounded-xl border bg-card p-5 shadow-sm sm:col-span-2 sm:row-span-2',
						pointsRankOne ? 'border-record/40' : 'border-border'
					)}
				>
					<span aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-record" />
					<div className="flex items-start justify-between">
						<span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
							Career Points
						</span>
						<RankBadge rank={stats.points_rank} />
					</div>
					<span className="font-display text-6xl font-black leading-none tabular-nums text-foreground sm:text-7xl">
						{fmt(stats.points)}
					</span>
				</div>

				{/* Secondary stats */}
				{SECONDARY_STATS.map((s) => (
					<div key={s.key as string} className="relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
						<div className="flex items-start justify-between">
							<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
								{s.label}
							</span>
							<RankBadge rank={stats[s.rankKey] as number | null} />
						</div>
						<span className="font-display text-3xl font-extrabold leading-none tabular-nums text-foreground">
							{fmt(stats[s.key] as number | null)}
						</span>
					</div>
				))}
			</div>

			<div className="rounded-xl border border-border bg-card p-5 shadow-sm">
				<h3 className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
					Shooting splits
				</h3>
				<div className="grid gap-5 sm:grid-cols-3">
					{SHOOTING_SPLITS.map((s) => (
						<ShootingBar
							key={s.label}
							label={s.label}
							pct={stats[s.pct] as number | null}
							made={stats[s.made] as number | null}
							att={stats[s.att] as number | null}
						/>
					))}
				</div>
			</div>
		</section>
	);
});

AllTimeStats.displayName = 'AllTimeStats';

const CareerSkeleton: React.FC = () => (
	<section className="space-y-6">
		<Skeleton className="h-9 w-56 rounded-lg" />
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-40 rounded-xl sm:col-span-2 sm:row-span-2" />
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-24 rounded-xl" />
			))}
		</div>
		<Skeleton className="h-32 rounded-xl" />
	</section>
);

export default AllTimeStats;
