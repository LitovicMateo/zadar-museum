import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CoachHero from '@/components/Coach/CoachHero/CoachHero';
import ErrorBoundary from '@/components/UI/ErrorBoundary';
import FloatingEditButton from '@/components/UI/FloatingEditButton/FloatingEditButton';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useCoachDetails } from '@/hooks/queries/coach/UseCoachDetails';

import CoachContent from './Content/CoachContent';

const Coach: React.FC = () => {
	const { coachId } = useParams();
	const navigate = useNavigate();

	const { data: coachDetails, isFetched } = useCoachDetails(coachId!);

	useEffect(() => {
		if (isFetched && !coachDetails) {
			navigate(APP_ROUTES.home);
		}
	}, [isFetched, coachDetails, navigate]);

	if (!coachDetails) return null;

	return (
		<GamesProvider>
			<div className="h-[calc(100svh-3.5rem)] overflow-y-auto bg-chalk">
				<ErrorBoundary>
					<CoachHero />
				</ErrorBoundary>
				<main id="coach-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
					<ErrorBoundary>
						<CoachContent />
					</ErrorBoundary>
				</main>
			</div>
			<FloatingEditButton to={`${APP_ROUTES.dashboard.coach.edit}${coachId}`} />
		</GamesProvider>
	);
};

export default Coach;
