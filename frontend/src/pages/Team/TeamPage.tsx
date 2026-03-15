import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TeamHeader from '@/components/Team/TeamPage/TeamHeader/TeamHeader';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';

import TeamContent from '../../components/Team/TeamPage/Content/TeamContent';
import { TeamErrorBoundary } from './TeamErrorBoundary';

import styles from './Team.module.css';

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
		<>
			<a href="#team-content" className={styles.skipLink}>
				Skip to team content
			</a>
			<GamesProvider>
				<TeamErrorBoundary>
					<TeamHeader />
				</TeamErrorBoundary>
				<main id="team-content" tabIndex={-1}>
					<TeamErrorBoundary>
						<TeamContent />
					</TeamErrorBoundary>
				</main>
			</GamesProvider>
		</>
	);
};

export default TeamPage;
