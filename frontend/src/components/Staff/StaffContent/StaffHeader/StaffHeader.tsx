import React from 'react';
import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import ProfileImage from '@/components/ui/ProfileImage/ProfileImage';
import { useStaffDetails } from '@/hooks/queries/staff/UseStaffDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import StaffBio from './StaffBio/StaffBio';

const StaffHeader: React.FC = () => {
	const { staffId } = useParams();

	const { data: staffDetails } = useStaffDetails(staffId!);

	console.log('STAFF HEADER', staffDetails);

	// return <div>Hello</div>;

	const imagePath = staffDetails?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<ProfileImage
				imageUrl={imageUrl}
				name={`${staffDetails?.first_name} ${staffDetails?.last_name}`}
				nationality={staffDetails?.nationality || ''}
			/>
			<StaffBio staff={staffDetails!} />
		</HeaderWrapper>
	);
};

export default StaffHeader;
