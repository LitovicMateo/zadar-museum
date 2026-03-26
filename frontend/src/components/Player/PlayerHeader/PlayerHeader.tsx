import React from 'react';
import { useParams } from 'react-router-dom';

import HeaderWrapper from '@/components/ui/HeaderWrapper/HeaderWrapper';
import ProfileImage from '@/components/ui/ProfileImage/ProfileImage';
import { HeaderSkeleton } from '@/components/ui/skeletons';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import PlayerBio from './player-bio/PlayerBio';
import PlayerNumber from './player-number/PlayerNumber';

const PlayerHeader: React.FC = React.memo(() => {
	const { playerId } = useParams();

	const { data: player, isLoading } = usePlayerDetails(playerId!);

	if (!player || isLoading) return <HeaderSkeleton />;

	const imagePath = player.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<HeaderWrapper>
			<ProfileImage
				imageUrl={imageUrl}
				name={`${player.first_name} ${player.last_name}`}
				nationality={player.nationality}
			/>
			<PlayerBio player={player} />
			<PlayerNumber />
		</HeaderWrapper>
	);
});

PlayerHeader.displayName = 'PlayerHeader';

export default PlayerHeader;
