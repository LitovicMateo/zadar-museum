import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LeagueHeader from '@/components/League/Header/LeagueHeader';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import ProfilePageWrapper from '@/components/UI/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';

import LeagueContent from './Content/LeagueContent';

const League: React.FC = () => {
	const { leagueSlug } = useParams();
	const navigate = useNavigate();

	const { data: leagueDetails, isFetched } = useLeagueDetails(leagueSlug!);

	useEffect(() => {
		if (!leagueDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [leagueDetails, isFetched, navigate]);

	return (
		<>
			<ProfilePageWrapper header={<LeagueHeader />} content={<LeagueContent />} />
			{leagueDetails && (
				<FloatingEditButton to={`${APP_ROUTES.dashboard.competition.edit}${leagueDetails.documentId}`} />
			)}
		</>
	);
};

export default League;
