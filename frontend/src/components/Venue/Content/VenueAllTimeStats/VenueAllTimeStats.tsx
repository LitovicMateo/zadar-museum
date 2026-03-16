import React from 'react';
import { useParams } from 'react-router-dom';

import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';

import VenueStats from './VenueStats';

import styles from './VenueAllTimeStats.module.css';

const VenueAllTimeStats: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: record } = useVenueTeamRecord(venueSlug!);

	if (!record || record.games === 0) {
		return null;
	}

	return (
		<section className={styles.section}>
			<VenueStats record={record} />
		</section>
	);
};

export default VenueAllTimeStats;
