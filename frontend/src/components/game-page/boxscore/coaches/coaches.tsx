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
		<div className="flex flex-col sm:flex-row gap-3">
			{coaches.coach && (
				<Link
					to={APP_ROUTES.coach(coaches.coach.documentId)}
					className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md group"
				>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-medium uppercase">Head Coach</span>
						<span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
							{coaches?.coach.first_name} {coaches?.coach.last_name}
						</span>
					</div>
				</Link>
			)}
			{coaches.assistantCoach && (
				<Link
					to={APP_ROUTES.coach(coaches.assistantCoach.documentId)}
					className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-gray-200 hover:border-blue-400 transition-all duration-200 hover:shadow-md group"
				>
					<div className="flex flex-col">
						<span className="text-xs text-gray-500 font-medium uppercase">Assistant Coach</span>
						<span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
							{coaches?.assistantCoach?.first_name} {coaches?.assistantCoach?.last_name}
						</span>
					</div>
				</Link>
			)}
		</div>
	);
};

export default Coaches;
