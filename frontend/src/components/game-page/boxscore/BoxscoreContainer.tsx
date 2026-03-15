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
import styles from './BoxscoreContainer.module.css';

type BoxscoreContainerProps = {
	teamSlug: string;
	teamName: string;
};

const BoxscoreContainer: React.FC<BoxscoreContainerProps> = ({ teamSlug, teamName }) => {
	const { gameId } = useParams();
	const { data: team } = useTeamDetails(teamSlug);

	const { data: boxscore, isLoading: isBoxscoreLoading } = useGameBoxscore(gameId!, teamSlug);

	if (isBoxscoreLoading || !boxscore) return <p>Loading...</p>;

	if (boxscore.length === 0) return <p className={styles.noPlayers}>{`No ${teamName} players found`}</p>;

	if (!team) return null;

	const imagePath = team?.image?.url;
	const imageUrl = getImageUrl(imagePath);

	return (
		<section className={styles.section}>
			<div className={styles.header}>
				<div className={styles.headerInner}>
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
