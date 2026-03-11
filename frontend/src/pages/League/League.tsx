import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import LeagueHeader from '@/components/league-page/league-header/LeagueHeader';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';

import LeagueContent from './LeagueContent';
import styles from '@/pages/League/League.module.css';

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
		<div className={styles.page}>
			<LeagueHeader />
			<LeagueContent />
		</div>
	);
};

export default League;
