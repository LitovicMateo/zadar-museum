import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TeamContent from '@/components/Team/TeamPage/Content/TeamContent';
import TeamHeader from '@/components/Team/TeamPage/TeamHeader/TeamHeader';
import ProfilePageWrapper from '@/components/ui/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { TeamErrorBoundary } from '@/pages/Team/TeamErrorBoundary';

import styles from './TeamPage.module.css';

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
			<ProfilePageWrapper
				header={
					<TeamErrorBoundary>
						<TeamHeader />
					</TeamErrorBoundary>
				}
				content={
					<main id="team-content" tabIndex={-1} className={styles.teamMain}>
						<TeamErrorBoundary>
							<TeamContent />
						</TeamErrorBoundary>
					</main>
				}
			/>
		</GamesProvider>
	);
};

export default TeamPage;
