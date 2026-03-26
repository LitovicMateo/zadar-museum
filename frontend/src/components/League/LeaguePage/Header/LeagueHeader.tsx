import React from 'react';
import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import LeagueLogo from './LeagueLogo/LeagueLogo';

import styles from './LeagueHeader.module.css';

const LeagueHeader: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueDetails } = useLeagueDetails(leagueSlug!);

	const imagePath = leagueDetails?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<LeagueLogo imageUrl={imageUrl} name={leagueDetails?.name || 'League'} />
			<h2 className={styles.name}>{leagueDetails?.name}</h2>
		</HeaderWrapper>
	);
};

export default LeagueHeader;
