import React from 'react';
import { useParams } from 'react-router-dom';

import { Skeleton } from '@/components/ui/skeleton';
import { zadarBg } from '@/constants/player-bg';
import { useCoachDetails } from '@/hooks/queries/coach/useCoachDetails';
import { getImageUrl } from '@/utils/getImageUrl';

import CoachBio from './coach-bio/coach-bio';
import CoachImage from './coach-image/coach-image';
import styles from './coach-header.module.css';

const CoachHeader: React.FC = () => {
	const { coachId } = useParams();

	const { data: coach, isLoading } = useCoachDetails(coachId!);

	if (!coach || isLoading) {
		return (
			<section className={`${styles.section} ${zadarBg}`} aria-busy="true" aria-label="Loading coach profile">
				<div className={styles.inner}>
					{/* Image placeholder */}
					<Skeleton className="h-[250px] min-w-[180px] shrink-0 rounded-none opacity-20" />
					{/* Bio placeholder */}
					<div className="flex flex-col justify-end gap-3 pb-6 w-full">
						<Skeleton className="h-4 w-24 opacity-20" />
						<Skeleton className="h-10 w-48 opacity-20" />
						<div className="mt-2 flex flex-col gap-2">
							<Skeleton className="h-4 w-32 opacity-20" />
							<Skeleton className="h-4 w-40 opacity-20" />
						</div>
					</div>
				</div>
			</section>
		);
	}

	const imagePath = coach.image?.url;
	const imageUrl = imagePath ? getImageUrl(imagePath) : null;

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
