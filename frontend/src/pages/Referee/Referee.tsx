import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RefereeHeader from '@/components/referee-page/referee-header/referee-header';
import { APP_ROUTES } from '@/constants/routes';
import { useRefereeDetails } from '@/hooks/queries/referee/useRefereeDetails';

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
