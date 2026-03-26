import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { useVenueDetails } from '@/hooks/queries/venue/UseVenueDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './VenueHeader.module.css';

const VenueHeader = () => {
	const { venueSlug } = useParams();

	const { data: venue } = useVenueDetails(venueSlug!);

	const image = venue?.image;
	const imageUrl = getImageUrl(image?.url);

	return (
		<HeaderWrapper>
			<div style={{ backgroundImage: `url(${imageUrl})` }} className={styles.header} />
			<div className={styles.nameWrapper}>
				<h2 className={styles.name}>{venue?.name}</h2>
			</div>
		</HeaderWrapper>
	);
};

export default VenueHeader;
