import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/PlayerBg';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import styles from './LeagueHeader.module.css';

const LeagueHeader: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueDetails } = useLeagueDetails(leagueSlug!);

	return (
		<section className={`${styles.section} ${zadarBg}`}>
			<h2 className={styles.name}>{leagueDetails?.name}</h2>
		</section>
	);
};

export default LeagueHeader;
