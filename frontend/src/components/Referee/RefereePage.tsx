import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';

import ProfilePageWrapper from '../ui/ProfilePageWrapper/ProfilePageWrapper';
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
	return <ProfilePageWrapper header={<RefereeHeader />} content={<RefereeContent />} />;
};

export default RefereePage;
