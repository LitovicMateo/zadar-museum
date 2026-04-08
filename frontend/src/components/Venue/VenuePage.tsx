import ProfilePageWrapper from '../UI/ProfilePageWrapper/ProfilePageWrapper';
import VenueContent from './Content/VenueContent';
import VenueHeader from './Header/VenueHeader';

const VenuePage = () => {
	return <ProfilePageWrapper header={<VenueHeader />} content={<VenueContent />} />;
};

export default VenuePage;
