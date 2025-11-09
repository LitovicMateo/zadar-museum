import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useCompetitionGames } from '@/hooks/queries/dasboard/useCompetitionGames';

type GameFilterProps = {
	season: string;
	league: string;
	setSelectedGame: React.Dispatch<React.SetStateAction<string>>;
};

const GameFilter: React.FC<GameFilterProps> = ({ season, league, setSelectedGame }) => {
	const { data: games } = useCompetitionGames(season, league);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	const gameOptions =
		games?.map((g) => ({
			value: g.id.toString(),
			label: `R${g.round}: ${g.home_team_name} vs ${g.away_team_name}`
		})) || [];

	// 🧠 Reset selected game if season or league becomes nullish
	useEffect(() => {
		if (!season || !league) {
			setSelectedOption(null);
			setSelectedGame('');
		}
	}, [season, league, setSelectedGame]);

	const handleChange = (option: SingleValue<OptionType>) => {
		setSelectedOption(option);
		setSelectedGame((option?.value as string) || '');
	};

	return (
		<Select
			value={selectedOption}
			onChange={handleChange}
			placeholder="Select Game"
			options={gameOptions}
			isClearable
			isDisabled={!season || !league}
			styles={selectStyle()}
		/>
	);
};

export default GameFilter;
