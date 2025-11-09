import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useRefereeDetails } from '@/hooks/queries/referee/useRefereeDetails';

const RefereeHeader: React.FC = () => {
	const { refereeId } = useParams();
	const { data: refereeDetails } = useRefereeDetails(refereeId!);

	return (
		<section className={`w-full flex justify-center items-center min-h-[100px] ${zadarBg}`}>
			<h2 className="text-blue-50 text-2xl font-mono uppercase tracking-widest">
				{refereeDetails?.first_name} {refereeDetails?.last_name}
			</h2>
		</section>
	);
};

export default RefereeHeader;
