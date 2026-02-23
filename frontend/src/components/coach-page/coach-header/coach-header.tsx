import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useCoachDetails } from '@/hooks/queries/coach/useCoachDetails';
import { getImageUrl } from '@/utils/getImageUrl';

import CoachBio from './coach-bio/coach-bio';
import CoachImage from './coach-image/coach-image';
import styles from './coach-header.module.css';

const CoachHeader: React.FC = () => {
	const { coachId } = useParams();

	const { data: coach, isLoading } = useCoachDetails(coachId!);

	if (!coach || isLoading) return <div>Loading...</div>;

	const imagePath = coach.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className={`${styles.section} ${zadarBg}`}>
			<div className={styles.inner}>
				<CoachImage imageUrl={imageUrl} name={`${coach.first_name} ${coach.last_name}`} />
				<CoachBio coach={coach} />
			</div>
		</section>
	);
};

export default CoachHeader;
