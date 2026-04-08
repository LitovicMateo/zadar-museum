import React from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import { useVenueTeamRecord } from '@/hooks/queries/venue/UseVenueTeamRecord';

import VenueStats from './VenueStats';

import styles from './VenueAllTimeStats.module.css';

const VenueAllTimeStats: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: record, isLoading } = useVenueTeamRecord(venueSlug!);

	console.log(record);

	if (isLoading) {
		return <div className={styles.loading}>Loading...</div>;
	}

	if (!record) {
		return <NoContent type="info" description="No games have been played at this venue." />;
	}

	return (
		<section className={styles.section}>
			<VenueStats record={record} />
		</section>
	);
};

export default VenueAllTimeStats;
