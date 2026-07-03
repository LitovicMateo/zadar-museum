import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import { Skeleton } from '@/components/UI/Skeleton';
import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';

const fmt = (v: number | null | undefined): string => (v == null ? '–' : `${v}`);

const SecondaryCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
	<div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-sm">
		<span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
			{label}
		</span>
		<span className="font-display text-3xl font-extrabold leading-none tabular-nums text-foreground">{value}</span>
	</div>
);

const VenueAllTimeStats: React.FC = () => {
	const { venueSlug } = useParams();
	const { data: record, isLoading } = useVenueTeamRecord(venueSlug!);

	if (isLoading) return <AllTimeSkeleton />;

	if (!record) {
		return <NoContent type="info" description="No games have been played at this venue." />;
	}

	return (
		<section className="space-y-6">
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				{/* Featured: Win % */}
				<div className="relative flex flex-col justify-between gap-4 rounded-xl border border-record/40 bg-card p-5 shadow-sm sm:col-span-2 sm:row-span-2">
					<span aria-hidden className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-record" />
					<span className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
						Win %
					</span>
					<span className="font-display text-6xl font-black leading-none tabular-nums text-foreground sm:text-7xl">
						{record.win_percentage == null ? '–' : `${record.win_percentage}%`}
					</span>
				</div>

				<SecondaryCard label="Games" value={fmt(record.games)} />
				<SecondaryCard label="Wins" value={fmt(record.wins)} />
				<SecondaryCard label="Losses" value={fmt(record.losses)} />
				<SecondaryCard label="Avg Attendance" value={fmt(record.avg_attendance)} />
			</div>
		</section>
	);
};

const AllTimeSkeleton: React.FC = () => (
	<section className="space-y-6">
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-40 rounded-xl sm:col-span-2 sm:row-span-2" />
			{Array.from({ length: 4 }).map((_, i) => (
				<Skeleton key={i} className="h-24 rounded-xl" />
			))}
		</div>
	</section>
);

export default VenueAllTimeStats;
