import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import TeamHeader from '@/components/team-page/team-header/team-header';
import { APP_ROUTES } from '@/constants/routes';
import { GamesProvider } from '@/context/games-context';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';

import TeamContent from './TeamContent';

const TeamPage: React.FC = () => {
	const { teamSlug } = useParams();
	const navigate = useNavigate();

	const { data: team, isFetched } = useTeamDetails(teamSlug!);

	useEffect(() => {
		if (isFetched && !team) {
			navigate(APP_ROUTES.home);
		}
	}, [isFetched, team, navigate]);

	return (
		<GamesProvider>
			<TeamHeader />
			<TeamContent />
		</GamesProvider>
	);
};

export default TeamPage;
