import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import SegmentedToggle, { SegmentedOption } from '@/components/UI/SegmentedToggle/SegmentedToggle';
import { Skeleton } from '@/components/UI/Skeleton';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';

type Role = 'total' | 'headCoach' | 'assistantCoach';
type Loc = 'total' | 'home' | 'away' | 'neutral';

const fmt = (v: number | null | undefined): string => (v == null ? '–' : `${v}`);

const SecondaryCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
	<div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
		<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{label}
		</span>
		<span className="font-display text-3xl font-extrabold leading-none tabular-nums text-foreground">{value}</span>
	</div>
);

const CoachCareerStats: React.FC = () => {
	const { coachId } = useParams();
	const { db } = useCoachProfileDatabase(coachId!);
	const { data: coachRecord, isLoading } = useCoachRecord(coachId!, db);

	const [role, setRole] = useState<Role>('total');
	const [location, setLocation] = useState<Loc>('total');

	const hasLoc = (l: Loc) => !!coachRecord?.[role]?.[l]?.games;

	const hasHome = hasLoc('home');
	const hasAway = hasLoc('away');
	const hasNeutral = hasLoc('neutral');

	useEffect(() => {
		if (location === 'home' && !hasHome) setLocation('total');
		else if (location === 'away' && !hasAway) setLocation('total');
		else if (location === 'neutral' && !hasNeutral) setLocation('total');
	}, [hasHome, hasAway, hasNeutral, location]);

	const roleOptions = useMemo<SegmentedOption<Role>[]>(
		() => [
			{ value: 'total', label: 'Total' },
			{ value: 'headCoach', label: 'Head', disabled: !coachRecord?.headCoach?.total?.games },
			{ value: 'assistantCoach', label: 'Assistant', disabled: !coachRecord?.assistantCoach?.total?.games }
		],
		[coachRecord]
	);

	const locationOptions = useMemo<SegmentedOption<Loc>[]>(
		() => [
			{ value: 'total', label: 'Total' },
			{ value: 'home', label: 'Home', disabled: !hasHome },
			{ value: 'away', label: 'Away', disabled: !hasAway },
			{ value: 'neutral', label: 'Neutral', disabled: !hasNeutral }
		],
		[hasHome, hasAway, hasNeutral]
	);

	if (isLoading || !coachRecord) return <CareerSkeleton />;

	const stats = coachRecord[role]?.[location] ?? coachRecord[role]?.total;
	if (!stats) return null;

	const diff = stats.points_difference;
	const diffColor = diff == null ? undefined : diff > 0 ? 'var(--positive)' : diff < 0 ? 'var(--negative)' : undefined;
	const diffText = diff == null ? '–' : `${diff > 0 ? '+' : ''}${diff}`;

	return (
		<section className="space-y-6">
			<MobileFilterSheet title="Filter record">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
					<SegmentedToggle value={role} onValueChange={setRole} options={roleOptions} ariaLabel="Coach role filter" />
					<SegmentedToggle
						value={location}
						onValueChange={setLocation}
						options={locationOptions}
						ariaLabel="Location filter"
					/>
				</div>
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
				<SecondaryCard
					label="Pts Diff"
					value={<span style={{ color: diffColor }}>{diffText}</span>}
				/>
				<SecondaryCard label="Pts For" value={fmt(stats.points_scored)} />
				<SecondaryCard label="Pts Against" value={fmt(stats.points_received)} />
			</div>
		</section>
	);
};

const CareerSkeleton: React.FC = () => (
	<section className="space-y-6">
		<Skeleton className="h-9 w-72 rounded-lg" />
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-40 rounded-xl sm:col-span-2 sm:row-span-2" />
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-24 rounded-xl" />
			))}
		</div>
	</section>
);

export default CoachCareerStats;
