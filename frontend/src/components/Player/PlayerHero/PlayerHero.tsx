import React from 'react';
import { useParams } from 'react-router-dom';
import Flag from 'react-world-flags';

import { Skeleton } from '@/components/UI/Skeleton';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/UseAllTimeStats';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';
import { usePlayerNumber } from '@/hooks/queries/player/UsePlayerNumber';
import { PlayerResponse } from '@/types/api/Player';
import { calculateAge } from '@/utils/CalculateAge';
import { getImageUrl } from '@/utils/GetImageUrl';
import { format } from 'date-fns';
import { Crown, User } from 'lucide-react';

// Categories surfaced as the hero's franchise-leader story, in priority order.
const LEADER_STATS = [
	{ label: 'Points', rankKey: 'points_rank' as const },
	{ label: 'Assists', rankKey: 'assists_rank' as const },
	{ label: 'Rebounds', rankKey: 'rebounds_rank' as const },
	{ label: 'Games', rankKey: 'games_rank' as const },
	{ label: '3PT', rankKey: 'three_pointers_made_rank' as const },
	{ label: 'Steals', rankKey: 'steals_rank' as const },
	{ label: 'Blocks', rankKey: 'blocks_rank' as const }
];

const Chip: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
	<span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-white ring-1 ring-inset ring-white/15">
		<span className="font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white/55">{label}</span>
		<span className="text-xs font-medium">{children}</span>
	</span>
);

const useFranchiseLeaderStats = (playerId: string): string[] => {
	const { selectedDatabase } = useBoxscore();
	const { data } = useAllTimeStats(playerId, selectedDatabase!);
	const total = data?.[0]?.total?.total;
	if (!total) return [];
	return LEADER_STATS.filter((s) => total[s.rankKey] === 1).map((s) => s.label);
};

const PlayerHero: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { data: player, isLoading } = usePlayerDetails(playerId!);
	const { data: number } = usePlayerNumber(playerId!);
	const leaderIn = useFranchiseLeaderStats(playerId!);

	if (isLoading || !player) return <HeroSkeleton />;

	return <HeroBanner player={player} jerseyNumber={number?.mostFrequentNumber ?? null} leaderIn={leaderIn} />;
});

PlayerHero.displayName = 'PlayerHero';

const HeroBanner: React.FC<{
	player: PlayerResponse;
	jerseyNumber: string | number | null;
	leaderIn: string[];
}> = ({ player, jerseyNumber, leaderIn }) => {
	const imageUrl = getImageUrl(player.image?.url);
	const fullName = `${player.first_name} ${player.last_name}`;

	const birthDateStr = player.date_of_birth ? format(new Date(player.date_of_birth), 'd MMM yyyy') : null;
	const deathDateStr = player.date_of_death ? format(new Date(player.date_of_death), 'd MMM yyyy') : null;
	const age = player.date_of_birth ? calculateAge(player.date_of_birth) : null;
	const ageAtDeath =
		player.date_of_birth && player.date_of_death ? calculateAge(player.date_of_birth, player.date_of_death) : null;

	const position = player.primary_position
		? `${player.primary_position}${player.secondary_position ? ` / ${player.secondary_position}` : ''}`.toUpperCase()
		: null;

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

			{/* Jersey number — monumental, outlined, bleeding off the right edge */}
			{jerseyNumber != null && (
				<span
					aria-hidden="true"
					className="pointer-events-none absolute -bottom-[0.22em] right-[-0.06em] select-none font-display font-black leading-none text-transparent"
					style={{
						fontSize: 'clamp(11rem, 34vw, 26rem)',
						WebkitTextStroke: '2px rgba(255,255,255,0.12)'
					}}
				>
					{jerseyNumber}
				</span>
			)}

			<div className="relative mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-end gap-x-4 px-4 pb-6 pt-7 sm:gap-x-7 sm:px-6 sm:pt-9 md:pb-8">
				{/* Photo */}
				<div className="flex h-28 w-24 shrink-0 items-end justify-center overflow-hidden self-end sm:h-44 sm:w-40 md:h-60 md:w-52">
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

				{/* Nameplate + meta pills, stacked under the name and baseline-aligned to the photo */}
				<div className="min-w-0 self-end">
					<p className="font-mono text-xs uppercase tracking-[0.3em] text-white/65 sm:text-sm">
						{player.first_name}
					</p>
					<h1 className="font-display font-black uppercase leading-[0.85] tracking-tight text-white [font-size:clamp(2rem,9vw,5.5rem)]">
						{player.last_name}
					</h1>
					<div className="mt-2 h-1 w-16 rounded-full bg-record sm:w-24" />

					<div className="mt-3 flex flex-wrap items-center gap-2">
						{position && <Chip label="Pos">{position}</Chip>}
						{player.height && <Chip label="Height">{player.height} cm</Chip>}
						{player.nationality && (
							<Chip label="Nat">
								<Flag code={player.nationality} className="h-3.5 w-5 rounded-[2px] object-cover" />
							</Chip>
						)}
						{deathDateStr ? (
							<Chip label="Born–Died">
								{birthDateStr} — {deathDateStr}
								{ageAtDeath !== null ? ` (${ageAtDeath})` : ''}
							</Chip>
						) : (
							<>
								{age !== null && <Chip label="Age">{age}</Chip>}
								{birthDateStr && <Chip label="Born">{birthDateStr}</Chip>}
							</>
						)}
					</div>

					{leaderIn.length > 0 && (
						<div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-record/15 px-3 py-2 ring-1 ring-inset ring-record/30">
							<span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] font-medium uppercase tracking-[0.12em] text-record">
								<Crown size={14} className="shrink-0" />
								Franchise #1
							</span>
							<span className="text-sm font-medium text-white/90">{leaderIn.join(' · ')}</span>
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
					<Skeleton className="h-7 w-24 rounded-full bg-white/10" />
					<Skeleton className="h-7 w-16 rounded-full bg-white/10" />
				</div>
			</div>
		</div>
	</section>
);

export default PlayerHero;
