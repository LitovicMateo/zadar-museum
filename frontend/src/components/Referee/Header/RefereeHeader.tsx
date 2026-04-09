import React from 'react';
import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/UI/HeaderWrapper/HeaderWrapper';
import ProfileImage from '@/components/UI/ProfileImage/ProfileImage';
import { useRefereeDetails } from '@/hooks/queries/referee/UseRefereeDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import RefereeBio from './RefereeBio/RefereeBio';

const RefereeHeader: React.FC = () => {
	const { refereeId } = useParams();
	const { data: refereeDetails } = useRefereeDetails(refereeId!);

	const imagePath = refereeDetails?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<ProfileImage
				imageUrl={imageUrl}
				name={`${refereeDetails?.first_name} ${refereeDetails?.last_name}`}
				nationality={refereeDetails?.nationality || ''}
			/>
			<RefereeBio referee={refereeDetails!} />
		</HeaderWrapper>
	);
};

export default RefereeHeader;
