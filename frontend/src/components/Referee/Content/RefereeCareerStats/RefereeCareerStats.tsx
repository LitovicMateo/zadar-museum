import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { Skeleton } from '@/components/UI/Skeleton';
import { useRefereeTeamRecord } from '@/hooks/queries/referee/UseRefereeTeamRecord';

type Loc = 'Total' | 'Home' | 'Away';

const fmt = (v: number | null | undefined): string => (v == null ? '–' : `${v}`);
const fmtDiff = (v: number | null | undefined): string => {
	if (v == null) return '–';
	return v > 0 ? `+${v}` : `${v}`;
};

const SecondaryCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
	<div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
		<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{label}
		</span>
		<span className="font-display text-3xl font-extrabold leading-none tabular-nums text-foreground">{value}</span>
	</div>
);

const RefereeCareerStats: React.FC = () => {
	const { refereeId } = useParams();
	const { data: refereeStats, isLoading } = useRefereeTeamRecord(refereeId!);

	const [location, setLocation] = useState<Loc>('Total');

	const hasHome = useMemo(
		() => (refereeStats?.stats.find((s) => s.key === 'Home')?.games ?? 0) > 0,
		[refereeStats]
	);
	const hasAway = useMemo(
		() => (refereeStats?.stats.find((s) => s.key === 'Away')?.games ?? 0) > 0,
		[refereeStats]
	);

	useEffect(() => {
		if (location === 'Home' && !hasHome) setLocation('Total');
		else if (location === 'Away' && !hasAway) setLocation('Total');
	}, [hasHome, hasAway, location]);

	const locationOptions = useMemo<SegmentedOption<Loc>[]>(
		() => [
			{ value: 'Total', label: 'Total' },
			{ value: 'Home', label: 'Home', disabled: !hasHome },
			{ value: 'Away', label: 'Away', disabled: !hasAway }
		],
		[hasHome, hasAway]
	);

	if (isLoading || !refereeStats) return <CareerSkeleton />;

	const stats = refereeStats.stats.find((s) => s.key === location) ?? refereeStats.stats.at(-1);
	if (!stats) return null;

	const diffColor =
		stats.foul_difference == null
			? undefined
			: stats.foul_difference > 0
				? 'var(--positive)'
				: stats.foul_difference < 0
					? 'var(--negative)'
					: undefined;

	return (
		<section className="space-y-6">
			<MobileFilterSheet title="Filter record">
				<SegmentedToggle
					value={location}
					onValueChange={setLocation}
					options={locationOptions}
					ariaLabel="Location filter"
				/>
			</MobileFilterSheet>

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{/* Featured: Win % */}
				<div className="relative flex flex-col justify-between gap-4 rounded-xl border border-record/40 bg-card p-5 shadow-sm sm:col-span-2 sm:row-span-2">
					<span aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-record" />
					<span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
						Win %
					</span>
					<span className="font-display text-6xl font-black leading-none tabular-nums text-foreground sm:text-7xl">
						{stats.win_percentage == null ? '–' : `${stats.win_percentage}%`}
					</span>
				</div>

				<SecondaryCard label="Wins" value={fmt(stats.wins)} />
				<SecondaryCard label="Losses" value={fmt(stats.losses)} />
				<SecondaryCard label="Games" value={fmt(stats.games)} />
				<SecondaryCard label="Fouls For" value={fmt(stats.fouls_for)} />
				<SecondaryCard label="Fouls Against" value={fmt(stats.fouls_against)} />
				<SecondaryCard
					label="Foul Diff"
					value={<span style={{ color: diffColor }}>{fmtDiff(stats.foul_difference)}</span>}
				/>
			</div>
		</section>
	);
};

const CareerSkeleton: React.FC = () => (
	<section className="space-y-6">
		<Skeleton className="h-9 w-48 rounded-lg" />
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-40 rounded-xl sm:col-span-2 sm:row-span-2" />
			{Array.from({ length: 6 }).map((_, i) => (
				<Skeleton key={i} className="h-24 rounded-xl" />
			))}
		</div>
	</section>
);

export default RefereeCareerStats;
