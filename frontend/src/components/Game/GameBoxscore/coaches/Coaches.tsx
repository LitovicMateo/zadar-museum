import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useGameTeamCoaches } from '@/hooks/queries/game/UseGameTeamCoaches';

type CoachesProps = {
	teamSlug: string;
};

const Coaches: React.FC<CoachesProps> = ({ teamSlug }) => {
	const { gameId } = useParams();

	const { data: coaches, isLoading } = useGameTeamCoaches(gameId!, teamSlug);

	if (isLoading || !coaches) return null;

	return (
		<div className="flex flex-col gap-2 sm:flex-row">
			{coaches.coach && (
				<Link
					to={APP_ROUTES.coach(coaches.coach.documentId)}
					className="flex flex-col rounded-md border border-white/15 bg-white/5 px-3 py-1.5 transition-colors hover:border-record"
				>
					<span className="font-mono text-[10px] uppercase tracking-[0.12em] text-court-foreground/50">
						Head Coach
					</span>
					<span className="text-sm font-semibold text-court-foreground">
						{coaches.coach.first_name} {coaches.coach.last_name}
					</span>
				</Link>
			)}
			{coaches.assistantCoach && (
				<Link
					to={APP_ROUTES.coach(coaches.assistantCoach.documentId)}
					className="flex flex-col rounded-md border border-white/15 bg-white/5 px-3 py-1.5 transition-colors hover:border-record"
				>
					<span className="font-mono text-[10px] uppercase tracking-[0.12em] text-court-foreground/50">
						Assistant Coach
					</span>
					<span className="text-sm font-semibold text-court-foreground">
						{coaches.assistantCoach.first_name} {coaches.assistantCoach.last_name}
					</span>
				</Link>
			)}
		</div>
	);
};

export default Coaches;
