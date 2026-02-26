import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameBoxscore } from '@/hooks/queries/game/useGameBoxscore';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { getImageUrl } from '@/utils/getImageUrl';
import { sortTeamBoxscore } from '@/utils/sortTeamBoxscore';

import Boxscore from './boxscore';
import Coaches from './coaches/coaches';
import Staffers from './staffers/staffers';
import TeamName from './team-name/team-name';

type BoxscoreContainerProps = {
	teamSlug: string;
	teamName: string;
};

const BoxscoreContainer: React.FC<BoxscoreContainerProps> = ({ teamSlug, teamName }) => {
	const { gameId } = useParams();
	const { data: team } = useTeamDetails(teamSlug);

	const { data: boxscore, isLoading: isBoxscoreLoading } = useGameBoxscore(gameId!, teamSlug);

	if (isBoxscoreLoading || !boxscore) return <p>Loading...</p>;

	if (boxscore.length === 0) return <p className="text-center">{`No ${teamName} players found`}</p>;

	if (!team) return null;

	const imagePath = team?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className="py-2 font-abel">
			<div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg px-4 py-3 mb-3 border-l-4 border-blue-500 shadow-sm">
				<div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
					<TeamName name={teamName} imageUrl={imageUrl} slug={teamSlug || ''} />
					<Coaches teamSlug={teamSlug} />
				</div>
			</div>
			<Boxscore boxscore={sortTeamBoxscore(boxscore)} />
			<Staffers teamSlug={teamSlug} />
		</section>
	);
};

export default BoxscoreContainer;
