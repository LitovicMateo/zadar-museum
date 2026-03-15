import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/Heading';
import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';

import VenueStats from './VenueStats';
import styles from './VenueAllTime.module.css';

const VenueAllTime: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: record } = useVenueTeamRecord(venueSlug!);

	if (!record || record.games === 0) {
		return null;
	}

	return (
		<section className={styles.section}>
			<Heading title="All Time Record" />
			<VenueStats record={record} />
		</section>
	);
};

export default VenueAllTime;
