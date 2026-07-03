import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ErrorBoundary from '@/components/UI/ErrorBoundary';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';

import RefereeHero from './RefereeHero/RefereeHero';
import RefereeContent from './Content/RefereeContent';

const RefereePage: React.FC = () => {
	const { refereeId } = useParams();
	const navigate = useNavigate();

	const { data: refereeDetails, isFetched } = useRefereeDetails(refereeId!);

	useEffect(() => {
		if (!refereeDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [refereeDetails, isFetched, navigate]);

	if (!refereeDetails) return null;

	return (
		<GamesProvider>
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<ErrorBoundary>
					<RefereeHero />
				</ErrorBoundary>
				<main id="referee-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<ErrorBoundary>
						<RefereeContent />
					</ErrorBoundary>
				</main>
			</div>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.referee.edit}${refereeId}`} />
		</GamesProvider>
	);
};

export default RefereePage;
