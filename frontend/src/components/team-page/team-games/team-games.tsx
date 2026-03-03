import React from 'react';

import CompetitionList from '@/components/games-page/games-filter/competition-list';
import GamesFilter from '@/components/games-page/games-filter/games-filter';
import GamesList from '@/components/games-page/games-list/games-list';
import { useGamesContext } from '@/hooks/context/useGamesContext';

import TeamSeasonStats from './team-season-stats';

const TeamGames: React.FC = () => {
	const { selectedCompetitions, competitions, toggleCompetition } = useGamesContext();

	return (
		<div className="w-full flex flex-col gap-4">
			<GamesFilter showCompetitions={false} />
			<TeamSeasonStats />
			<CompetitionList
				competitions={competitions}
				selectedCompetitions={selectedCompetitions}
				toggleCompetition={toggleCompetition}
			/>
			{selectedCompetitions.map((slug) => (
				<GamesList key={slug} competitionSlug={slug} />
			))}
			{selectedCompetitions.length === 0 && (
				<div className="text-2xl h-screen flex items-center justify-center text-gray-400">
					No competitions selected
				</div>
			)}
		</div>
	);
};

export default TeamGames;
