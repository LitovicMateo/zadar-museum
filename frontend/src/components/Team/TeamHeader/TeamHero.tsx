import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Flag from 'react-world-flags';

import { Skeleton } from '@/components/UI/Skeleton';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { useTeamTitles } from '@/hooks/queries/team/UseTeamTitles';
import { TeamDetailsResponse } from '@/types/api/Team';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Shield, Trophy } from 'lucide-react';

const Chip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-inset ring-white/15">
		<span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/55">{label}</span>
		<span className="text-xs font-medium">{children}</span>
	</span>
);


const TitlesStrip: React.FC = () => {
	const { data: titles } = useTeamTitles();
	if (!titles?.length) return null;

	return (
		<div className="flex flex-wrap items-center gap-2">
			{titles.map((t) => (
				<Link
					key={t.short_name}
					to={`/league/${t.slug}`}
					className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-sm text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/20"
				>
					<span className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-white/55">{t.short_name}</span>
					<Trophy size={12} className="text-record" />
					<span className="font-medium tabular-nums">×{t.count}</span>
				</Link>
			))}
		</div>
	);
};

const TeamHero: React.FC = React.memo(() => {
	const { teamSlug } = useParams();
	const { data: team, isLoading } = useTeamDetails(teamSlug!);

	if (isLoading || !team) return <HeroSkeleton />;

	return <HeroBanner team={team} />;
});

TeamHero.displayName = 'TeamHero';

const HeroBanner: React.FC<{ team: TeamDetailsResponse }> = ({ team }) => {
	const imageUrl = getImageUrl(team.image?.url);

	return (
		<section className="relative overflow-hidden bg-court text-white" aria-label={`${team.name} profile`}>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-70"
				style={{
					background:
						'radial-gradient(120% 140% at 18% 120%, color-mix(in oklab, var(--primary) 55%, transparent) 0%, transparent 55%)'
				}}
			/>

			{team.short_name && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-[0.18em] right-[-0.04em] select-none font-display font-black uppercase leading-none text-transparent"
					style={{
						fontSize: 'clamp(7rem, 22vw, 18rem)',
						WebkitTextStroke: '2px rgba(255,255,255,0.1)'
					}}
				>
					{team.short_name}
				</span>
			)}

			<div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-end gap-x-4 gap-y-5 px-4 pb-6 pt-7 sm:gap-x-7 sm:px-6 sm:pt-9 md:pb-8">
				{/* Logo tile */}
				<div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-lg sm:h-36 sm:w-36 md:h-44 md:w-44">
					{imageUrl ? (
						<img src={imageUrl} alt={team.name} className="h-full w-full object-contain" />
					) : (
						<Shield size={96} strokeWidth={1} className="text-court/40" />
					)}
				</div>

				{/* Nameplate */}
				<div className="min-w-0">
					<h1 className="font-display font-black uppercase leading-[0.9] tracking-tight text-white [font-size:clamp(1.75rem,7vw,4.5rem)]">
						{team.name}
					</h1>
					<div className="mt-2 h-1 w-16 rounded-full bg-record sm:w-24" />
					{/* Titles sit directly under the name to keep the hero compact (esp. on mobile) */}
					{team.isMainTeam && (
						<div className="mt-3">
							<TitlesStrip />
						</div>
					)}
					{/* City/Country pills sit right under the name */}
					<div className="mt-3 flex flex-wrap items-center gap-2">
						{team.city && <Chip label="City">{team.city}</Chip>}
						{team.country && (
							<Chip label="Country">
								<Flag code={team.country} className="h-3.5 w-5 rounded-[2px] object-cover" />
							</Chip>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

const HeroSkeleton: React.FC = () => (
	<section className="relative overflow-hidden bg-court">
		<div className="mx-auto flex max-w-6xl items-end gap-4 px-4 pb-6 pt-7 sm:gap-7 sm:px-6 sm:pt-9">
			<Skeleton className="h-24 w-24 rounded-2xl bg-white/10 sm:h-36 sm:w-36 md:h-44 md:w-44" />
			<div className="flex flex-1 flex-col gap-3 pb-2">
				<Skeleton className="h-3 w-24 bg-white/10" />
				<Skeleton className="h-12 w-2/3 bg-white/10" />
				<div className="flex gap-2">
					<Skeleton className="h-7 w-20 rounded-full bg-white/10" />
					<Skeleton className="h-7 w-24 rounded-full bg-white/10" />
				</div>
			</div>
		</div>
	</section>
);

export default TeamHero;
