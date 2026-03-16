import React from 'react';
import { useParams } from 'react-router-dom';

import CoachBio from '@/components/Coach/CoachPage/Header/Bio/CoachBio';
import ProfileImage from '@/components/ProfileImage/ProfileImage';
import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import { zadarBg } from '@/constants/PlayerBg';
import { useCoachDetails } from '@/hooks/queries/coach/UseCoachDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './CoachHeader.module.css';

const CoachHeader: React.FC = () => {
	const { coachId } = useParams();

	const { data: coach, isLoading } = useCoachDetails(coachId!);

	if (!coach || isLoading) {
		return (
			<section className={`${styles.section} ${zadarBg}`} aria-busy="true" aria-label="Loading coach profile">
				<div className={styles.inner}>
					{/* Image placeholder */}
					<Skeleton className={styles.skeletonImage} />
					{/* Bio placeholder */}
					<div className={styles.skeletonBio}>
						<Skeleton className={styles.skeletonName} />
						<Skeleton className={styles.skeletonNameLg} />
						<div className={styles.skeletonDetails}>
							<Skeleton className={styles.skeletonLine} />
							<Skeleton className={styles.skeletonLineLg} />
						</div>
					</div>
				</div>
			</section>
		);
	}

	const imagePath = coach.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<ProfileImage
				imageUrl={imageUrl}
				name={`${coach.first_name} ${coach.last_name}`}
				nationality={coach.nationality}
			/>
			<CoachBio coach={coach} />
		</HeaderWrapper>
	);
};

export default CoachHeader;
