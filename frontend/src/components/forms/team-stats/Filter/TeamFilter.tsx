import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useGameTeams } from '@/hooks/queries/game/useGameTeams';

type TeamFilterProps = {
	game: string;
	setTeam: React.Dispatch<React.SetStateAction<string>>;
};

const TeamFilter: React.FC<TeamFilterProps> = ({ game, setTeam }) => {
	const { data: teams } = useGameTeams(game);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	const teamOptions =
		teams?.teams?.map((team) => ({
			value: team.id.toString(),
			label: team.name
		})) || [];

	// 🧠 Reset selected team if game becomes nullish or changes
	useEffect(() => {
		if (!game) {
			setSelectedOption(null);
			setTeam('');
		}
	}, [game, setTeam]);

	const handleChange = (option: SingleValue<OptionType>) => {
		setSelectedOption(option);
		setTeam((option?.value as string) || '');
	};

	return (
		<Select
			value={selectedOption}
			onChange={handleChange}
			placeholder="Select Team"
			options={teamOptions}
			isClearable
			isDisabled={!game}
			styles={selectStyle()}
		/>
	);
};

export default TeamFilter;
