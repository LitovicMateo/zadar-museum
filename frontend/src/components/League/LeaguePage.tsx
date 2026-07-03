import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorBoundary from '@/components/UI/ErrorBoundary';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';

import LeagueHero from './LeagueHero/LeagueHero';
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

	if (!leagueDetails) return null;

	return (
		<GamesProvider>
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<ErrorBoundary>
					<LeagueHero />
				</ErrorBoundary>
				<main id="league-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<ErrorBoundary>
						<LeagueContent />
					</ErrorBoundary>
				</main>
			</div>
			{leagueDetails && (
				<FloatingEditButton to={`${APP_ROUTES.dashboard.competition.edit}${leagueDetails.documentId}`} />
			)}
		</GamesProvider>
	);
};

export default League;
