import React from 'react';
import { useParams } from 'react-router-dom';

import { usePlayerNumber } from '@/hooks/queries/player/usePlayerNumber';

const PlayerNumber: React.FC = () => {
	const { playerId } = useParams<{ playerId: string }>();

	const { data, isLoading } = usePlayerNumber(playerId!);

	if (isLoading) return null;

	return (
		<div className="float-right absolute top-2 right-2 sm:bottom-0 sm:right-4">
			<svg className="w-full h-fit max-w-[120px] sm:max-w-[200px]" viewBox="0 0 100 100">
				<text
					x="50%"
					y="50%"
					dominantBaseline="middle"
					textAnchor="middle"
					fill="transparent" // number interior is transparent
					stroke="#f1f5f9" // outline color
					strokeWidth={1} // thin outline
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
