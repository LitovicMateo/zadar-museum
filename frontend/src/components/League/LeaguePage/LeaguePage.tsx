import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LeagueHeader from '@/components/League/LeaguePage/Header/LeagueHeader';
import ProfilePageWrapper from '@/components/ui/ProfilePageWrapper/ProfilePageWrapper';
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

	return <ProfilePageWrapper header={<LeagueHeader />} content={<LeagueContent />} />;
};

export default League;
