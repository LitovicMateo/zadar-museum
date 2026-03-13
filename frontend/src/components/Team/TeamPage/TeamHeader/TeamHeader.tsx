import React from 'react';
import { useParams } from 'react-router-dom';
import Flag from 'react-world-flags';

import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './TeamHeader.module.css';

const TeamHeader: React.FC = () => {
	const { teamSlug } = useParams();

	const { data, isLoading } = useTeamDetails(teamSlug!);

	if (data === undefined || isLoading) return null;

	const imagePath = data?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className={styles.section}>
			<div className={styles.inner}>
				<div className={styles.circle}>
					<img src={imageUrl} alt={data.name} className={styles.logo} />
					{data?.country && (
						<div className={styles.flag}>
							<Flag code={data.country} className={styles.flagImg} />
						</div>
					)}
				</div>
				<h2 className={styles.teamName}>{data.name}</h2>
			</div>
		</section>
	);
};

export default TeamHeader;
