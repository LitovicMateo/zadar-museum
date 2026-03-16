import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProfilePageWrapper from '@/components/ui/ProfilePageWrapper/ProfilePageWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { GamesProvider } from '@/context/GamesContext';
import { useCoachDetails } from '@/hooks/queries/coach/UseCoachDetails';

import CoachContent from './Content/CoachContent';
import CoachHeader from './Header/CoachHeader';

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
		<GamesProvider>
			<ProfilePageWrapper header={<CoachHeader />} content={<CoachContent />} />
		</GamesProvider>
	);
};

export default Coach;
