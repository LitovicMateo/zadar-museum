import React from 'react';
import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/card';
import { APP_ROUTES } from '@/constants/Routes';
import { cn } from '@/lib/Utils';
import { StrapiImage } from '@/types/api/Strapi';
import { TeamScheduleResponse } from '@/types/api/Team';

import TeamLogo from './TeamLogo';

type GameCardProps = {
	game: TeamScheduleResponse;
	roundLabel?: string;
	/** Slug of the team whose perspective drives win/loss colouring (usually KK Zadar). */
	perspectiveSlug?: string;
	logos: Map<string, StrapiImage>;
};

type Outcome = 'win' | 'loss' | 'draw' | 'none';

const getOutcome = (game: TeamScheduleResponse, perspectiveSlug?: string): Outcome => {
	const { home_score, away_score } = game;
	if (typeof home_score !== 'number' || typeof away_score !== 'number') return 'none';
	if (home_score === away_score) return 'draw';
	const homeWon = home_score > away_score;
	const perspectiveIsHome = !!perspectiveSlug && game.home_team_slug === perspectiveSlug;
	if (!perspectiveSlug || (!perspectiveIsHome && game.away_team_slug !== perspectiveSlug)) return 'none';
	return (homeWon && perspectiveIsHome) || (!homeWon && !perspectiveIsHome) ? 'win' : 'loss';
};

const scoreClasses: Record<Outcome, string> = {
	win: 'bg-green-600 text-white',
	loss: 'bg-red-600 text-white',
	draw: 'bg-muted text-foreground',
	none: 'bg-muted text-muted-foreground'
};

const TeamSide: React.FC<{
	name?: string | null;
	shortName?: string | null;
	slug: string;
	logos: Map<string, StrapiImage>;
	align: 'left' | 'right';
}> = ({ name, shortName, slug, logos, align }) => (
	<div className={cn('flex min-w-0 flex-1 items-center gap-2', align === 'right' && 'flex-row-reverse text-right')}>
		<TeamLogo name={name} image={logos.get(slug)} className="h-7 w-7 shrink-0" />
		<span className="min-w-0 truncate text-sm">
			<span className="hidden sm:inline">{name}</span>
			<span className="sm:hidden">{shortName ?? name}</span>
		</span>
	</div>
);

const GameCard: React.FC<GameCardProps> = ({ game, roundLabel, perspectiveSlug, logos }) => {
	const outcome = getOutcome(game, perspectiveSlug);
	const date = game.game_date
		? new Date(game.game_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
		: '-';
	const hasScore = typeof game.home_score === 'number' || typeof game.away_score === 'number';
	const scoreLabel = hasScore ? `${game.home_score ?? '-'} - ${game.away_score ?? '-'}` : '-';

	return (
		<Link to={APP_ROUTES.game(game.game_document_id.toString())} className="block">
			<Card className="flex-row items-center gap-3 px-3 py-2.5 transition-colors hover:bg-accent">
				<div className="flex w-16 shrink-0 flex-col text-xs text-muted-foreground">
					<span>{date}</span>
					{roundLabel && <span className="truncate">{roundLabel}</span>}
				</div>
				<TeamSide
					name={game.home_team_name}
					shortName={game.home_team_short_name}
					slug={game.home_team_slug}
					logos={logos}
					align="right"
				/>
				<div
					className={cn(
						'shrink-0 rounded-md px-2.5 py-1 text-sm font-semibold tabular-nums',
						scoreClasses[outcome]
					)}
				>
					{scoreLabel}
				</div>
				<TeamSide
					name={game.away_team_name}
					shortName={game.away_team_short_name}
					slug={game.away_team_slug}
					logos={logos}
					align="left"
				/>
			</Card>
		</Link>
	);
};

export default GameCard;
