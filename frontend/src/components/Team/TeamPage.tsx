import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TeamContent from '@/components/Team/Content/TeamContent';
import { TeamErrorBoundary } from '@/components/Team/TeamErrorBoundary';
import TeamHero from '@/components/Team/TeamHeader/TeamHero';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';

const TeamPage: React.FC = () => {
	const { teamSlug } = useParams();
	const navigate = useNavigate();

	const { data: team, isFetched } = useTeamDetails(teamSlug!);

	useEffect(() => {
		if (isFetched && !team) {
			navigate(APP_ROUTES.home);
		}
	}, [isFetched, team, navigate]);

	if (!team) return null;

	return (
		<GamesProvider>
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<TeamErrorBoundary>
					<TeamHero />
				</TeamErrorBoundary>
				<main id="team-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<TeamErrorBoundary>
						<TeamContent />
					</TeamErrorBoundary>
				</main>
			</div>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.team.edit}${team.documentId}`} />
		</GamesProvider>
	);
};

export default TeamPage;
