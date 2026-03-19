import React from 'react';
import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';

import styles from './RefereeHeader.module.css';

const RefereeHeader: React.FC = () => {
	const { refereeId } = useParams();
	const { data: refereeDetails } = useRefereeDetails(refereeId!);

	return (
		<HeaderWrapper>
			<div className={styles.nameWrapper}>
				<h2 className={styles.name}>
					{refereeDetails?.first_name} {refereeDetails?.last_name}
				</h2>
			</div>
		</HeaderWrapper>
	);
};

export default RefereeHeader;
