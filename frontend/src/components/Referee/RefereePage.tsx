import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';

import FloatingEditButton from '../UI/FloatingEditButton/FloatingEditButton';
import ProfilePageWrapper from '../UI/ProfilePageWrapper/ProfilePageWrapper';
import RefereeContent from './Content/RefereeContent';
import RefereeHeader from './Header/RefereeHeader';

const RefereePage = () => {
	const { refereeId } = useParams();
	const navigate = useNavigate();

	const { data: refereeDetails, isFetched } = useRefereeDetails(refereeId!);

	useEffect(() => {
		if (!refereeDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [refereeDetails, isFetched, navigate]);
	return (
		<>
			<ProfilePageWrapper header={<RefereeHeader />} content={<RefereeContent />} />
			<FloatingEditButton to={`${APP_ROUTES.dashboard.referee.edit}${refereeId}`} />
		</>
	);
};

export default RefereePage;
