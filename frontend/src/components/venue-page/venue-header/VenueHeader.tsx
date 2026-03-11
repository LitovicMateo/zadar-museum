import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/PlayerBg';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';
import styles from './VenueHeader.module.css';

const VenueHeader: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: venue } = useVenueDetails(venueSlug!);

	return (
		<section className={`${styles.section} ${zadarBg}`}>
			<h2 className={styles.name}>{venue?.name}</h2>
		</section>
	);
};

export default VenueHeader;
