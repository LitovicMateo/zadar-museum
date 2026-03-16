import React from 'react';
import { useParams } from 'react-router-dom';

import ProfileImage from '@/components/ProfileImage/ProfileImage';
import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import styles from './TeamHeader.module.css';

const TeamHeader: React.FC = () => {
	const { teamSlug } = useParams();

	const { data, isLoading } = useTeamDetails(teamSlug!);

	if (data === undefined || isLoading) return null;

	const imagePath = data?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<ProfileImage imageUrl={imageUrl} name={data.name} nationality={data.country} />
			<h2 className={styles.teamName}>{data.name}</h2>
		</HeaderWrapper>
	);
};

export default TeamHeader;
