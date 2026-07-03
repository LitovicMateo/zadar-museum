import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameBoxscore } from '@/hooks/queries/game/UseGameBoxscore';
import { useTeamDetails } from '@/hooks/queries/team/UseTeamDetails';
import { getImageUrl } from '@/utils/GetImageUrl';
import { sortTeamBoxscore } from '@/utils/SortTeamBoxscore';

import Boxscore from './Boxscore';
import Coaches from './coaches/Coaches';
import Staffers from './staffers/Staffers';
import TeamName from './team-name/TeamName';

type BoxscoreContainerProps = {
	teamSlug: string;
	teamName: string;
};

const BoxscoreContainer: React.FC<BoxscoreContainerProps> = ({ teamSlug, teamName }) => {
	const { gameId } = useParams();
	const { data: team } = useTeamDetails(teamSlug);

	const { data: boxscore, isLoading: isBoxscoreLoading } = useGameBoxscore(gameId!, teamSlug);

	if (isBoxscoreLoading || !boxscore) return <p className="text-sm text-muted-foreground">Loading...</p>;

	if (boxscore.length === 0)
		return <p className="text-sm text-muted-foreground">{`No ${teamName} players found`}</p>;

	if (!team) return null;

	const imagePath = team?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className="flex flex-col gap-3">
			<div className="flex flex-col gap-3 rounded-lg border-l-4 border-record bg-court px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:py-3">
				<TeamName name={teamName} imageUrl={imageUrl} slug={teamSlug || ''} />
				<Coaches teamSlug={teamSlug} />
			</div>
			<Boxscore boxscore={sortTeamBoxscore(boxscore)} />
			<Staffers teamSlug={teamSlug} />
		</section>
	);
};

export default BoxscoreContainer;
