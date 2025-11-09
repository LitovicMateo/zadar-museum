import React from 'react';
import Flag from 'react-world-flags';

import { TeamDetailsResponse } from '@/types/api/team';

type TeamBioProps = {
	team: TeamDetailsResponse;
};

const TeamBio: React.FC<TeamBioProps> = ({ team }) => {
	return (
		<div className="h-fit flex flex-col text-white font-mono">
			<div className="border-b-1 border-white border-solid">
				<h2 className="font-bold flex flex-col">
					<span className="text-4xl uppercase">{team.name}</span>
				</h2>
			</div>
			<div className="h-fit py-4 flex flex-col justify-start gap-2 items-start">
				<label htmlFor="" className="text-sm flex gap-2 justify-center items-center">
					Country:
					<div className="h-[16px]  aspect-video rounded-xs overflow-hidden">
						<Flag className="object-cover object- h-full" code={team.country} />
					</div>
				</label>
			</div>
		</div>
	);
};

export default TeamBio;
