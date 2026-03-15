import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/PlayerBg';
import styles from './RefereeHeader.module.css';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';

const RefereeHeader: React.FC = () => {
	const { refereeId } = useParams();
	const { data: refereeDetails } = useRefereeDetails(refereeId!);

	return (
		<section className={`${styles.section} ${zadarBg}`}>
			<h2 className={styles.name}>
				{refereeDetails?.first_name} {refereeDetails?.last_name}
			</h2>
		</section>
	);
};

export default RefereeHeader;
