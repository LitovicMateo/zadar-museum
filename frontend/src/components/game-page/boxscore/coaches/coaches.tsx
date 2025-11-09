import React from 'react';
import { Link, useParams } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useGameTeamCoaches } from '@/hooks/queries/game/useGameTeamCoaches';

type CoachesProps = {
	teamSlug: string;
};

const Coaches: React.FC<CoachesProps> = ({ teamSlug }) => {
	const { gameId } = useParams();

	const { data: coaches, isLoading } = useGameTeamCoaches(gameId!, teamSlug);

	if (isLoading || !coaches) return null;

	return (
		<div className="flex gap-8">
			<div className="flex flex-col lg:flex-row lg:gap-2 items-baseline">
				<span className="text-xs">Head coach: </span>
				<span>
					<Link to={APP_ROUTES.coach(coaches.coach.documentId)}>
						{coaches?.coach.first_name} {coaches?.coach.last_name}
					</Link>
				</span>
			</div>
			{coaches.assistantCoach && (
				<div className="flex flex-col lg:flex-row lg:gap-2 items-baseline">
					<span className="text-xs">Assistant coach:</span>{' '}
					<span>
						<Link to={APP_ROUTES.coach(coaches.assistantCoach.documentId)}>
							{coaches?.assistantCoach?.first_name} {coaches?.assistantCoach?.last_name}
						</Link>
					</span>
				</div>
			)}
		</div>
	);
};

export default Coaches;
