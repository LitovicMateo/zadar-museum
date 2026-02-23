import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CoachHeader from '@/components/coach-page/coach-header/coach-header';
import { APP_ROUTES } from '@/constants/routes';
import { useCoachDetails } from '@/hooks/queries/coach/useCoachDetails';

import CoachContent from './CoachContent';

const Coach: React.FC = () => {
	const { coachId } = useParams();
	const navigate = useNavigate();

	const { data: coachDetails, isFetched } = useCoachDetails(coachId!);

	useEffect(() => {
		if (isFetched && !coachDetails) {
			navigate(APP_ROUTES.home);
		}
	}, [isFetched, coachDetails, navigate]);

	return (
		<>
			<a href="#coach-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-white focus:text-blue-800">
				Skip to content
			</a>
			<CoachHeader />
			<main id="coach-content" className="flex flex-col gap-1">
				<CoachContent />
			</main>
		</>
	);
};

export default Coach;
