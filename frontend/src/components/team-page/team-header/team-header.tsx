import React from 'react';
import { useParams } from 'react-router-dom';
import Flag from 'react-world-flags';

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
			<div className="h-full w-full relative max-w-[800px] flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center sm:justify-start items-center sm:items-end mx-auto px-4 pt-4 sm:pt-0">
				{/* logo wrapper: smaller on mobile, keep original on sm+ */}
				<div className="shrink-0 relative w-28 h-28 sm:w-auto sm:h-auto">
					<div className="absolute inset-0 rounded-full overflow-hidden bg-white p-2 sm:static sm:inset-auto sm:rounded-none sm:overflow-visible sm:bg-transparent sm:p-0">
						<TeamLogo imageUrl={imageUrl} name={data.name} />
					</div>
					{data?.country && (
						<div
							className="absolute -right-1 -bottom-1 sm:hidden w-8 h-8 rounded-full overflow-hidden"
							style={{
								boxShadow: '0 0 0 3px rgba(255,255,255,0.95), 0 6px 12px rgba(8,38,107,0.45)'
							}}
						>
							<Flag code={data.country} className="w-full h-full object-cover" />
						</div>
					)}
				</div>
				{/* bio centered on mobile, left on larger screens */}
				<div className="w-full text-center sm:text-left">
					<TeamBio team={data} />
				</div>
			</div>
		</section>
	);
};

export default TeamHeader;
