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
	});

	return (
		<div className="flex flex-col gap-1">
			<CoachHeader />
			<CoachContent />
		</div>
	);
};

export default Coach;
