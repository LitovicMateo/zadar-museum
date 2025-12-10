import React from 'react';
import Flag from 'react-world-flags';

import { TeamDetailsResponse } from '@/types/api/team';

type TeamBioProps = {
	team: TeamDetailsResponse;
};

const TeamBio: React.FC<TeamBioProps> = ({ team }) => {
	return (
		<div className="h-fit flex flex-col text-white font-mono">
			<h2 className="font-bold mb-4 sm:mb-6">
				<span className="text-4xl uppercase">{team.name}</span>
			</h2>

			{/* desktop-only separator and country */}
			<div className="hidden sm:block border-b border-white border-solid mb-4" />

			<div className="hidden sm:flex h-fit py-4 flex-col justify-start gap-2 items-start">
				<label htmlFor="" className="text-sm flex gap-2 items-center">
					Country:
					<div className="h-[16px] aspect-video rounded-xs overflow-hidden">
						<Flag className="w-full h-full object-cover" code={team.country} />
					</div>
				</label>
			</div>
		</div>
	);
};

export default TeamBio;
