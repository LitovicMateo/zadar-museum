import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';

import styles from './VenueHeader.module.css';

const VenueHeader = () => {
	const { venueSlug } = useParams();

	const { data: venue } = useVenueDetails(venueSlug!);

	return (
		<HeaderWrapper>
			<div className={styles.nameWrapper}>
				<h2 className={styles.name}>{venue?.name}</h2>
			</div>
		</HeaderWrapper>
	);
};

export default VenueHeader;
