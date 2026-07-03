import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import { Skeleton } from '@/components/UI/Skeleton';
import { useLeagueTeamRecord } from '@/hooks/queries/league/UseLeagueTeamRecord';
import { TeamLeagueRecord } from '@/types/api/Team';

const fmt = (v: string | number | null | undefined): string => {
	if (v == null) return '–';
	const n = Number(v);
	return isNaN(n) ? '–' : `${n}`;
};

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

const LeagueAllTime: React.FC = () => {
	const { leagueSlug } = useParams();
	const { data: leagueRecord, isLoading } = useLeagueTeamRecord(leagueSlug!);

	if (isLoading) return <AllTimeSkeleton />;

	if (!leagueRecord || !leagueRecord.stats || leagueRecord.stats.length === 0) {
		return <NoContent type="info" description="No games have been played in this competition." />;
	}

	const total: TeamLeagueRecord =
		leagueRecord.stats.find((s) => s.key?.toLowerCase() === 'total') ?? leagueRecord.stats.at(-1)!;

	const diffColor =
		total.points_diff == null
			? undefined
			: total.points_diff > 0
				? 'var(--positive)'
				: total.points_diff < 0
					? 'var(--negative)'
					: undefined;

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
						{total.win_percentage == null ? '–' : `${total.win_percentage}%`}
					</span>
				</div>

				<SecondaryCard label="Games" value={fmt(total.games)} />
				<SecondaryCard label="Wins" value={fmt(total.wins)} />
				<SecondaryCard label="Losses" value={fmt(total.losses)} />
				<SecondaryCard
					label="Pts Diff"
					value={<span style={{ color: diffColor }}>{fmtDiff(total.points_diff)}</span>}
				/>
				<SecondaryCard label="Attendance" value={fmt(total.attendance)} />
			</div>
		</section>
	);
};

const AllTimeSkeleton: React.FC = () => (
	<section className="space-y-6">
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<Skeleton className="h-40 rounded-xl sm:col-span-2 sm:row-span-2" />
			{Array.from({ length: 5 }).map((_, i) => (
				<Skeleton key={i} className="h-24 rounded-xl" />
			))}
		</div>
	</section>
);

export default LeagueAllTime;
