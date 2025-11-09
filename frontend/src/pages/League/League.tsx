import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LeagueHeader from '@/components/league-page/league-header/league-header';
import { APP_ROUTES } from '@/constants/routes';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';

import LeagueContent from './LeagueContent';

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
		<div className="flex flex-col gap-2">
			<LeagueHeader />
			<LeagueContent />
		</div>
	);
};

export default League;
