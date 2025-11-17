import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useCoachDetails } from '@/hooks/queries/coach/useCoachDetails';
import { getImageUrl } from '@/utils/getImageUrl';

import CoachBio from './coach-bio/coach-bio';
import CoachImage from './coach-image/coach-image';

const CoachHeader: React.FC = () => {
	const { coachId } = useParams();

	const { data: coach, isLoading } = useCoachDetails(coachId!);

	if (!coach || isLoading) return <div>Loading...</div>;

	const imagePath = coach.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className={`max-h-[250px] ${zadarBg} drop-shadow-xl overflow-hidden`}>
			<div className="h-full w-full relative max-w-[800px] flex gap-6 justify-start items-end mx-auto">
				<CoachImage imageUrl={imageUrl} name={`${coach.first_name} ${coach.last_name}`} />
				<CoachBio coach={coach} />
			</div>
		</section>
	);
};

export default CoachHeader;
