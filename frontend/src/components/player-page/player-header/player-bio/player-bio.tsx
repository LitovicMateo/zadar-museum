import React from 'react';
import Flag from 'react-world-flags';
import { format } from 'date-fns';

import { PlayerResponse } from '@/types/api/player';
import { calculateAge } from '@/utils/calculateAge';

type PlayerBio = {
	player: PlayerResponse;
};

const PlayerBio: React.FC<PlayerBio> = ({ player }) => {
	const birthDateStr =
		!!player.date_of_birth &&
		format(new Date(player.date_of_birth), 'd MMM yyyy');

	const deathDateStr = !!player.date_of_death && format(new Date(player.date_of_death), 'd MMM yyyy');

	const age = player.date_of_birth ? calculateAge(player.date_of_birth) : null;
	const ageAtDeath = player.date_of_birth && player.date_of_death ? calculateAge(player.date_of_birth, player.date_of_death) : null;
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
						{player.nationality ? (
							<Flag className="object-cover object- h-full" code={player.nationality} />
						) : (
							<span className="text-gray-300">-</span>
						)}
					</div>
				</label>
				<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
					Position:
					<span className="uppercase">
						{player.primary_position ? (
							<>{player.primary_position}{player.secondary_position ? ` / ${player.secondary_position}` : ''}</>
						) : (
							<span className="text-gray-300">-</span>
						)}
					</span>
				</label>
				{player.height && (
					<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
						Height:
						<span className="uppercase">{player.height} cm</span>
					</label>
				)}
				{deathDateStr ? (
					<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
						<span>{`Born: ${birthDateStr} — Died: ${deathDateStr}`}</span>
						{ageAtDeath !== null && <span className="uppercase">{`(aged ${ageAtDeath})`}</span>}
					</label>
				) : (
					birthDateStr && (
						<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
							{`Age: ${age}`}
							<span className="uppercase">{`(${birthDateStr})`}</span>
						</label>
					)
				)}
			</div>
		</div>
	);
};

export default PlayerBio;
