import React from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/components/UI/Skeleton';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';
import { VenueDetailsResponse } from '@/types/api/Venue';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Building } from 'lucide-react';

const Chip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<span className="inline-flex items-baseline gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-inset ring-white/15">
		<span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/55">{label}</span>
		<span className="text-xs font-medium">{children}</span>
	</span>
);

const VenueHero: React.FC = React.memo(() => {
	const { venueSlug } = useParams();
	const { data: venue, isLoading } = useVenueDetails(venueSlug!);

	if (isLoading || !venue) return <HeroSkeleton />;

	return <HeroBanner venue={venue} />;
});

VenueHero.displayName = 'VenueHero';

const HeroBanner: React.FC<{ venue: VenueDetailsResponse }> = ({ venue }) => {
	const imageUrl = getImageUrl(venue.image?.url);

	return (
		<section className="relative overflow-hidden bg-court text-white" aria-label={`${venue.name} profile`}>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						'radial-gradient(120% 140% at 18% 120%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 55%)'
				}}
			/>

			<div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-start gap-x-4 gap-y-5 px-4 pb-6 pt-7 sm:items-end sm:gap-x-7 sm:px-6 sm:pt-9 md:pb-8">
				{/* Venue image */}
				<div className="row-span-2 flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden sm:h-44 sm:w-40 sm:self-end md:h-60 md:w-52">
					{imageUrl ? (
						<img
							src={imageUrl}
							alt={venue.name}
							className="h-full w-full object-cover drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
						/>
					) : (
						<div className="flex h-full w-full items-end justify-center">
							<Building size={120} strokeWidth={1} className="text-white/40" />
						</div>
					)}
				</div>

				{/* Nameplate */}
				<div className="min-w-0 sm:self-end">
					<h1 className="font-display font-black uppercase leading-[0.85] tracking-tight text-white [font-size:clamp(1.75rem,7vw,4.5rem)]">
						{venue.name}
					</h1>
					<div className="mt-2 h-1 w-16 rounded-full bg-record sm:w-24" />
				</div>

				{/* Meta */}
				<div className="col-start-2 flex flex-wrap items-center gap-2">
					{venue.city && <Chip label="City">{venue.city}</Chip>}
					{venue.country && <Chip label="Country">{venue.country}</Chip>}
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
					<Skeleton className="h-7 w-24 rounded-full bg-white/10" />
				</div>
			</div>
		</div>
	</section>
);

export default VenueHero;
