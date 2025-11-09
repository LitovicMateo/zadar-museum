import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { getImageUrl } from '@/utils/getImageUrl';

import TeamBio from './team-bio/team-bio';
import TeamLogo from './team-logo/team-logo';

const TeamHeader: React.FC = () => {
	const { teamSlug } = useParams();

	const { data, isLoading } = useTeamDetails(teamSlug!);

	if (data === undefined || isLoading) return null;

	const imagePath = data?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section
			className={`max-h-[250px] min-h-[150px] ${zadarBg} border-b-4 border-white drop-shadow-xl overflow-hidden`}
		>
			<div className="h-full w-full relative max-w-[800px] flex gap-6 justify-start items-end mx-auto">
				<TeamLogo imageUrl={imageUrl} name={data.name} />
				<TeamBio team={data} />
			</div>
		</section>
	);
};

export default TeamHeader;
