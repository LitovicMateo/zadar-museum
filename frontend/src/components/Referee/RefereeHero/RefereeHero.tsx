import React from 'react';
import { useParams } from 'react-router-dom';
import Flag from 'react-world-flags';

import { Skeleton } from '@/components/UI/Skeleton';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';
import { RefereeDetailsResponse } from '@/types/api/Referee';
import { getImageUrl } from '@/utils/GetImageUrl';
import { User } from 'lucide-react';

const Chip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-inset ring-white/15">
		<span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/55">{label}</span>
		<span className="text-xs font-medium">{children}</span>
	</span>
);

const RefereeHero: React.FC = React.memo(() => {
	const { refereeId } = useParams();
	const { data: referee, isLoading } = useRefereeDetails(refereeId!);

	if (isLoading || !referee) return <HeroSkeleton />;

	return <HeroBanner referee={referee} />;
});

RefereeHero.displayName = 'RefereeHero';

const HeroBanner: React.FC<{ referee: RefereeDetailsResponse }> = ({ referee }) => {
	const imageUrl = getImageUrl(referee.image?.url);
	const fullName = `${referee.first_name} ${referee.last_name}`;

	return (
		<section className="relative overflow-hidden bg-court text-white" aria-label={`${fullName} profile`}>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						'radial-gradient(120% 140% at 18% 120%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 55%)'
				}}
			/>

			<div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-start gap-x-4 gap-y-5 px-4 pb-6 pt-7 sm:items-end sm:gap-x-7 sm:px-6 sm:pt-9 md:pb-8">
				{/* Photo */}
				<div className="row-span-2 flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden sm:h-44 sm:w-40 sm:self-end md:h-60 md:w-52">
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
						{referee.first_name}
					</p>
					<h1 className="font-display font-black uppercase leading-[0.85] tracking-tight text-white [font-size:clamp(2rem,9vw,5.5rem)]">
						{referee.last_name}
					</h1>
					<div className="mt-2 h-1 w-16 rounded-full bg-record sm:w-24" />
				</div>

				{/* Meta */}
				<div className="col-start-2 flex flex-wrap items-center gap-2">
					{referee.nationality && (
						<Chip label="Nat">
							<Flag code={referee.nationality} className="h-3.5 w-5 rounded-[2px] object-cover" />
						</Chip>
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
					<Skeleton className="h-7 w-16 rounded-full bg-white/10" />
				</div>
			</div>
		</div>
	</section>
);

export default RefereeHero;
