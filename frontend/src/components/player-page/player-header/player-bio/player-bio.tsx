import React from 'react';
import Flag from 'react-world-flags';

import { PlayerResponse } from '@/types/api/player';
import { calculateAge } from '@/utils/calculateAge';

type PlayerBio = {
	player: PlayerResponse;
};

const PlayerBio: React.FC<PlayerBio> = ({ player }) => {
	const date =
		!!player.date_of_birth &&
		new Date(player.date_of_birth).toLocaleString('default', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});

	const age = calculateAge(player.date_of_birth);
	return (
		<div className="h-fit flex flex-col text-white font-mono">
			<div className="border-b-1 border-white border-solid">
				<h2 className="font-bold flex flex-col">
					<span className="text-sm">{player.first_name}</span>
					<span className="text-4xl uppercase">{player.last_name}</span>
				</h2>
			</div>
			<div className="h-fit py-4 flex flex-col justify-start gap-2 items-start">
				<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
					Nationality:
					<div className="h-[16px]  aspect-video rounded-xs overflow-hidden">
						<Flag className="object-cover object- h-full" code={player.nationality} />
					</div>
				</label>
				<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
					Position:
					<span className="uppercase">
						{player.primary_position} {player.secondary_position && `/ ${player.secondary_position}`}
					</span>
				</label>
				{player.height && (
					<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
						Height:
						<span className="uppercase">{player.height} cm</span>
					</label>
				)}
				{date && (
					<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
						{`Age: ${age}`}
						<span className="uppercase">{`(${date})`}</span>
					</label>
				)}
			</div>
		</div>
	);
};

export default PlayerBio;
