import React from 'react';
import { useParams } from 'react-router-dom';

import { HeaderSkeleton } from '@/components/ui/skeletons';
import { usePlayerDetails } from '@/hooks/queries/player/UsePlayerDetails';
import { getImageUrl } from '@/utils/GetImageUrl';

import PlayerBio from './player-bio/PlayerBio';
import PlayerImage from './player-image/PlayerImage';
import PlayerNumber from './player-number/PlayerNumber';
import styles from './PlayerHeader.module.css';

const PlayerHeader: React.FC = React.memo(() => {
	const { playerId } = useParams();

	const { data: player, isLoading } = usePlayerDetails(playerId!);

	if (!player || isLoading) return <HeaderSkeleton />;

	const imagePath = player.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className={styles.section}>
			<div className={styles.inner}>
				<PlayerImage imageUrl={imageUrl} name={`${player.first_name} ${player.last_name}`} nationality={player.nationality} />
				<PlayerBio player={player} />
				<PlayerNumber />
			</div>
		</section>
	);
});

PlayerHeader.displayName = 'PlayerHeader';

export default PlayerHeader;
