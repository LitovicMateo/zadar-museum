import React from 'react';
import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/UI/HeaderWrapper/HeaderWrapper';
import ProfileImage from '@/components/UI/ProfileImage/ProfileImage';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Shield } from 'lucide-react';

import styles from './TeamHeader.module.css';

const TeamHeader: React.FC = () => {
	const { teamSlug } = useParams();

	const { data, isLoading } = useTeamDetails(teamSlug!);

	if (data === undefined || isLoading) return null;

	const imagePath = data?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<ProfileImage
				fallback={<Shield size={180} color="#fff" strokeWidth={1} />}
				imageUrl={imageUrl}
				name={data.name}
				nationality={data.country}
				variant="logo"
			/>
			<h2 className={styles.teamName}>{data.name}</h2>
		</HeaderWrapper>
	);
};

export default TeamHeader;
