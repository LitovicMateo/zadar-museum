import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useCompetitionGames } from '@/hooks/queries/dasboard/useCompetitionGames';

type GameFilterProps = {
	season: string;
	league: string;
	selectedGame: string;
	setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
};

const GameFilter: React.FC<GameFilterProps> = ({ season, league, selectedGame, setSelectedGame }) => {
	const { data: games } = useCompetitionGames(season, league);

	const gameOptions =
		games?.map((g) => ({
			value: g.documentId,
			label: `R${g.round}: ${g.home_team_name} vs ${g.away_team_name}`
		})) || [];

	return (
		<Select
			value={gameOptions?.find((opt) => opt.value === selectedGame)}
			onChange={(opt) => setSelectedGame(opt?.value as string)}
			placeholder="Select Game"
			options={gameOptions}
			isClearable
			isDisabled={!season || !league}
			styles={selectStyle()}
		/>
	);
};

export default GameFilter;
