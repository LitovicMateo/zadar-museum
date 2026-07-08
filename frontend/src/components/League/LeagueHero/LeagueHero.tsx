import React from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/components/UI/Skeleton';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import { CompetitionDetailsResponse } from '@/types/api/Competition';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Trophy } from 'lucide-react';

const LeagueHero: React.FC = React.memo(() => {
	const { leagueSlug } = useParams();
	const { data: league, isLoading } = useLeagueDetails(leagueSlug!);

	if (isLoading || !league) return <HeroSkeleton />;

	return <HeroBanner league={league} />;
});

LeagueHero.displayName = 'LeagueHero';

const HeroBanner: React.FC<{ league: CompetitionDetailsResponse }> = ({ league }) => {
	const imageUrl = getImageUrl(league.image?.url);
	const hasTrophies = league.trophies && league.trophies.length > 0;
	const sortedTrophies = hasTrophies ? [...league.trophies].sort((a, b) => Number(a) - Number(b)) : [];

	return (
		<section className="relative overflow-hidden bg-court text-white" aria-label={`${league.name} profile`}>
			{/* Ambient glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						'radial-gradient(120% 140% at 18% 120%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 55%)'
				}}
			/>

			{/* Watermark */}
			{league.short_name && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none font-display font-black uppercase text-transparent sm:right-6"
					style={{
						fontSize: 'clamp(5rem, 18vw, 14rem)',
						WebkitTextStroke: '1px rgba(255,255,255,0.07)'
					}}
				>
					{league.short_name}
				</span>
			)}

			<div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-start gap-x-4 gap-y-5 px-4 pb-6 pt-7 sm:items-end sm:gap-x-7 sm:px-6 sm:pt-9 md:pb-8">
				{/* Logo */}
				<div className="row-span-2 flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden sm:h-44 sm:w-40 sm:self-end md:h-60 md:w-52">
					{imageUrl ? (
						<div className="flex h-full w-full items-end justify-center pb-1">
							<img
								src={imageUrl}
								alt={league.name}
								className="max-h-full max-w-full object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
							/>
						</div>
					) : (
						<div className="flex h-full w-full items-end justify-center">
							<Trophy size={100} strokeWidth={1} className="text-white/40" />
						</div>
					)}
				</div>

				{/* Nameplate */}
				<div className="min-w-0 sm:self-end">
					<h1 className="font-display font-black uppercase leading-[0.85] tracking-tight text-white [font-size:clamp(1.75rem,7vw,4.5rem)]">
						{league.name}
					</h1>
					<div className="mt-2 h-1 w-16 rounded-full bg-record sm:w-24" />
				</div>

				{/* Meta */}
				<div className="col-start-2 flex flex-col gap-3">
					{hasTrophies && (
						<div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-record/15 px-3 py-2 ring-1 ring-inset ring-record/30">
							<span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-record">
								<Trophy size={14} className="shrink-0" />
								Trophies
							</span>
							<span className="text-sm font-medium text-white/90">{sortedTrophies.join(', ')}</span>
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
				<Skeleton className="h-12 w-2/3 bg-white/10" />
				<div className="flex gap-2">
					<Skeleton className="h-7 w-20 rounded-full bg-white/10" />
				</div>
			</div>
		</div>
	</section>
);

export default LeagueHero;
