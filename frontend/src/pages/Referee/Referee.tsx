import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RefereeHeader from '@/components/referee-page/referee-header/RefereeHeader';
import { APP_ROUTES } from '@/constants/Routes';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';

import RefereeContent from './RefereeContent';

const Referee: React.FC = () => {
	const { refereeId } = useParams();
	const navigate = useNavigate();

	const { data: refereeDetails, isFetched } = useRefereeDetails(refereeId!);

	useEffect(() => {
		if (!refereeDetails && isFetched) {
			navigate(APP_ROUTES.home);
		}
	}, [refereeDetails, isFetched, navigate]);

	return (
		<div>
			<RefereeHeader />
			<RefereeContent />
		</div>
	);
};

export default Referee;
