import React from 'react';
import { useParams } from 'react-router-dom';

import { HeaderSkeleton } from '@/components/ui/skeletons';
import { zadarBg } from '@/constants/player-bg';
import { usePlayerDetails } from '@/hooks/queries/player/usePlayerDetails';
import { getImageUrl } from '@/utils/getImageUrl';

import PlayerBio from './player-bio/player-bio';
import PlayerImage from './player-image/player-image';
import PlayerNumber from './player-number/player-number';

const PlayerHeader: React.FC = React.memo(() => {
	const { playerId } = useParams();

	const { data: player, isLoading } = usePlayerDetails(playerId!);

	if (!player || isLoading) return <HeaderSkeleton />;

	const imagePath = player.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className={`max-h-[250px] ${zadarBg} drop-shadow-xl overflow-hidden`}>
			<div className="h-full w-full relative max-w-[800px] flex flex-col sm:flex-row gap-4 sm:gap-6 justify-start items-center sm:items-end mx-auto p-4 sm:p-0">
				<PlayerImage imageUrl={imageUrl} name={`${player.first_name} ${player.last_name}`} />
				<PlayerBio player={player} />
				<PlayerNumber />
			</div>
		</section>
	);
});

PlayerHeader.displayName = 'PlayerHeader';

export default PlayerHeader;
