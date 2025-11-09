import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameBoxscore } from '@/hooks/queries/game/useGameBoxscore';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { getImageUrl } from '@/utils/getImageUrl';
import { sortTeamBoxscore } from '@/utils/sortTeamBoxscore';

import Boxscore from './boxscore';
import Coaches from './coaches/coaches';
import TeamName from './team-name/team-name';

type BoxscoreContainerProps = {
	teamSlug: string;
};

const BoxscoreContainer: React.FC<BoxscoreContainerProps> = ({ teamSlug }) => {
	const { gameId } = useParams();
	const { data: team } = useTeamDetails(teamSlug);

	const { data: boxscore, isLoading: isBoxscoreLoading } = useGameBoxscore(gameId!, team?.slug);

	if (isBoxscoreLoading || !boxscore) return <p>Loading...</p>;

	if (boxscore.length === 0) return <p className="text-center">{`No ${team?.name} players found`}</p>;

	if (!team) return null;

	const imagePath = team?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className="py-2 font-abel">
			<div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-500 uppercase">
				<TeamName name={team?.name || ''} imageUrl={imageUrl} slug={team?.slug || ''} />
				<Coaches teamSlug={team.slug} />
			</div>
			<Boxscore boxscore={sortTeamBoxscore(boxscore)} />
		</section>
	);
};

export default BoxscoreContainer;
