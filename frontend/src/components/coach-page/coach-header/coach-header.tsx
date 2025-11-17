import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useCoachDetails } from '@/hooks/queries/coach/useCoachDetails';

const CoachHeader: React.FC = () => {
	const { coachId } = useParams();

	const { data: coachDetails } = useCoachDetails(coachId!);

	console.log(coachDetails);

	return (
		<section className={`w-full flex justify-center items-center min-h-[100px] ${zadarBg}`}>
			<h2 className="text-blue-50 text-2xl font-mono uppercase tracking-widest">
				{coachDetails?.first_name} {coachDetails?.last_name}
			</h2>
		</section>
	);
};

export default CoachHeader;
