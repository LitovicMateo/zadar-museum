import React from 'react';
import { useParams } from 'react-router-dom';
import Flag from 'react-world-flags';

import { Skeleton } from '@/components/UI/Skeleton';
import { useCoachRecord } from '@/hooks/queries/coach/UseCoachRecord';
import { useCoachDetails } from '@/hooks/queries/coach/UseCoachDetails';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';
import { CoachDetailsResponse, CoachRecordResponse } from '@/types/api/Coach';
import { calculateAge } from '@/utils/CalculateAge';
import { getImageUrl } from '@/utils/GetImageUrl';
import { format } from 'date-fns';
import { Trophy, User } from 'lucide-react';

const Chip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-inset ring-white/15">
		<span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/55">{label}</span>
		<span className="text-xs font-medium">{children}</span>
	</span>
);

const CoachHero: React.FC = React.memo(() => {
	const { coachId } = useParams();
	const { data: coach, isLoading } = useCoachDetails(coachId!);
	const { db } = useCoachProfileDatabase(coachId!);
	const { data: record } = useCoachRecord(coachId!, db);

	if (isLoading || !coach) return <HeroSkeleton />;

	return <HeroBanner coach={coach} record={record} />;
});

CoachHero.displayName = 'CoachHero';

const HeroBanner: React.FC<{
	coach: CoachDetailsResponse;
	record: CoachRecordResponse | undefined;
}> = ({ coach, record }) => {
	const imageUrl = getImageUrl(coach.image?.url);
	const fullName = `${coach.first_name} ${coach.last_name}`;

	const birthDateStr = coach.date_of_birth ? format(new Date(coach.date_of_birth), 'd MMM yyyy') : null;
	const deathDateStr = coach.date_of_death ? format(new Date(coach.date_of_death), 'd MMM yyyy') : null;
	const age = coach.date_of_birth ? calculateAge(coach.date_of_birth) : null;
	const ageAtDeath =
		coach.date_of_birth && coach.date_of_death ? calculateAge(coach.date_of_birth, coach.date_of_death) : null;

	const careerRecord = record?.total?.total;
	const hasRecord = !!careerRecord?.games;

	return (
		<section className="relative overflow-hidden bg-court text-white" aria-label={`${fullName} profile`}>
			{/* Court-line glow — the single ambient motif behind the nameplate */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						'radial-gradient(120% 140% at 18% 120%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 55%)'
				}}
			/>

			<div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-start sm:items-end gap-x-4 gap-y-5 px-4 pb-6 pt-7 sm:gap-x-7 sm:px-6 sm:pt-9 md:pb-8">
				{/* Photo */}
				<div className="row-span-2 flex h-28 w-24 shrink-0 items-end justify-center sm:self-end overflow-hidden sm:h-44 sm:w-40 md:h-60 md:w-52">
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={fullName}
							className="h-full w-full object-contain object-bottom drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
						/>
					) : (
						<div className="flex h-full w-full items-end justify-center">
							<User size={120} strokeWidth={1} className="text-white/40" />
						</div>
					)}
				</div>

				{/* Nameplate */}
				<div className="min-w-0 sm:self-end">
					<p className="font-mono text-xs uppercase tracking-[0.3em] text-white/65 sm:text-sm">
						{coach.first_name}
					</p>
					<h1 className="font-display font-black uppercase leading-[0.85] tracking-tight text-white [font-size:clamp(2rem,9vw,5.5rem)]">
						{coach.last_name}
					</h1>
					<div className="mt-2 h-1 w-16 rounded-full bg-record sm:w-24" />
				</div>

				{/* Meta + career record */}
				<div className="col-start-2 flex flex-col gap-3">
					<div className="flex flex-wrap items-center gap-2">
						{coach.nationality && (
							<Chip label="Nat">
								<Flag code={coach.nationality} className="h-3.5 w-5 rounded-[2px] object-cover" />
							</Chip>
						)}
						{deathDateStr ? (
							<Chip label="Born–Died">
								{birthDateStr} — {deathDateStr}
								{ageAtDeath !== null ? ` (${ageAtDeath})` : ''}
							</Chip>
						) : (
							age !== null && birthDateStr && <Chip label="Age">{`${age} · ${birthDateStr}`}</Chip>
						)}
					</div>

					{hasRecord && (
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-record/15 px-3 py-2 ring-1 ring-inset ring-record/30">
							<span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-record">
								<Trophy size={14} className="shrink-0" />
								Record
							</span>
							<span className="text-sm font-medium tabular-nums text-white/90">
								{careerRecord!.wins}–{careerRecord!.losses}
								<span className="text-white/55"> · </span>
								{careerRecord!.win_percentage}% Win
							</span>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

const HeroSkeleton: React.FC = () => (
	<section className="relative overflow-hidden bg-court">
		<div className="mx-auto flex max-w-6xl items-end gap-4 px-4 pb-6 pt-7 sm:gap-7 sm:px-6 sm:pt-9">
			<Skeleton className="h-28 w-24 bg-white/10 sm:h-44 sm:w-40 md:h-60 md:w-52" />
			<div className="flex flex-1 flex-col gap-3 pb-2">
				<Skeleton className="h-3 w-24 bg-white/10" />
				<Skeleton className="h-14 w-2/3 bg-white/10" />
				<div className="flex gap-2">
					<Skeleton className="h-7 w-20 rounded-full bg-white/10" />
					<Skeleton className="h-7 w-40 rounded-full bg-white/10" />
				</div>
			</div>
		</div>
	</section>
);

export default CoachHero;
