import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { APP_ROUTES } from '@/constants/Routes';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { useGameScore } from '@/hooks/queries/game/UseGameScore';
import { cn } from '@/lib/Utils';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Shield } from 'lucide-react';

import GameInfo from './GameInfo';
import GameLineScore from './GameLineScore';

type TeamSide = {
	slug: string;
	shortName: string;
	fullName: string;
	imageUrl: string;
};

const TeamBlock: React.FC<{ team: TeamSide }> = ({ team }) => (
	<Link
		to={APP_ROUTES.team(team.slug)}
		className="group flex flex-col items-center gap-2 sm:gap-3"
	>
		<div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-white/20 transition-transform group-hover:scale-105 sm:size-24 sm:p-2">
			{team.imageUrl && !team.imageUrl.includes('undefined') ? (
				<img src={team.imageUrl} alt={team.fullName} className="h-full w-full object-contain" />
			) : (
				<Shield className="size-8 text-court sm:size-12" strokeWidth={1.5} />
			)}
		</div>
		<div className="text-center">
			<p className="font-display text-base font-bold text-court-foreground transition-colors group-hover:text-record sm:hidden">
				{team.shortName}
			</p>
			<p className="hidden font-display text-lg font-bold text-court-foreground transition-colors group-hover:text-record sm:block sm:text-xl">
				{team.fullName}
			</p>
		</div>
	</Link>
);

const GameHeader: React.FC = () => {
	const { gameId } = useParams();

	const { data: game, isLoading } = useGameDetails(gameId!);
	const { data: score } = useGameScore(gameId!);

	if (!game || isLoading) return null;

	const home: TeamSide = {
		slug: game.home_team.slug,
		shortName: game.home_team_short_name,
		fullName: game.home_team_name,
		imageUrl: game.home_team?.image?.url ? getImageUrl(game.home_team.image.url) : ''
	};

	const away: TeamSide = {
		slug: game.away_team.slug,
		shortName: game.away_team_short_name,
		fullName: game.away_team_name,
		imageUrl: game.away_team?.image?.url ? getImageUrl(game.away_team.image.url) : ''
	};

	const homeScore = score?.home_score;
	const awayScore = score?.away_score;

	const hasScores = homeScore != null && awayScore != null;
	const homeWon = hasScores && homeScore > awayScore;
	const awayWon = hasScores && awayScore > homeScore;

	const scoreClass = (won: boolean) =>
		cn(
			'font-display font-black tabular-nums leading-none text-4xl sm:text-6xl',
			won ? 'text-record' : 'text-court-foreground/60'
		);

	return (
		<section className="bg-court text-court-foreground shadow-sm">
			{/* Record Gold accent bar */}
			<div className="h-1 w-full bg-record" aria-hidden />

			<div className="flex flex-col gap-5 px-4 py-6 sm:px-8 sm:py-8">
				{/* Teams + score */}
				<div className="mx-auto grid w-full max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8">
					<TeamBlock team={home} />

					<div className="flex flex-col items-center gap-3">
						<div className="flex items-center gap-2 sm:gap-4">
							<span className={scoreClass(homeWon)}>{homeScore ?? '–'}</span>
							<span className="font-display text-2xl font-bold text-court-foreground/40 sm:text-4xl">:</span>
							<span className={scoreClass(awayWon)}>{awayScore ?? '–'}</span>
						</div>
						{game.forfeited && <Badge variant="destructive">FORFEITED</Badge>}
						{game.isNulled && <Badge variant="outline" className="border-white/30 text-court-foreground/80">NULLED</Badge>}
					</div>

					<TeamBlock team={away} />
				</div>

				{/* Quarter-by-quarter line score */}
				<GameLineScore />

				{/* Meta info */}
				<GameInfo />
			</div>
		</section>
	);
};

export default GameHeader;
