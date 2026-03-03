import React from 'react';
import { useParams } from 'react-router-dom';

import { usePlayerNumber } from '@/hooks/queries/player/usePlayerNumber';

import styles from './player-number.module.css';

const PlayerNumber: React.FC = () => {
	const { playerId } = useParams<{ playerId: string }>();

	const { data, isLoading } = usePlayerNumber(playerId!);

	if (isLoading) return <div className={styles.placeholder} aria-hidden="true" />;

	return (
		<div className={styles.container}>
			<svg className={styles.svg} viewBox="0 0 100 100" aria-hidden="true">
				<text
					x="50%"
					y="50%"
					dominantBaseline="middle"
					textAnchor="middle"
					fill="transparent"
					stroke="#f1f5f9"
					strokeWidth={1}
					style={{ fontSize: 'clamp(40px, 10vw, 90px)' }}
					fontFamily="Arial, sans-serif"
				>
					{data!.mostFrequentNumber}
				</text>
			</svg>
		</div>
	);
};

export default PlayerNumber;
