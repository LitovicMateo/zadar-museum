import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useGamePlayerStats } from '@/hooks/queries/player-stats/useGamePlayerStats';
import { PlayerStatsResponse } from '@/types/api/player-stats';

type PlayerFilterProps = {
	game: string;
	team: string;
	setPlayerStatsId: React.Dispatch<React.SetStateAction<string>>;
};

const PlayerFilter: React.FC<PlayerFilterProps> = ({ game, team, setPlayerStatsId }) => {
	const { data: playerStats } = useGamePlayerStats(game, team);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	const playerStatsOptions =
		playerStats?.map((player: PlayerStatsResponse) => ({
			value: player.documentId,
			label: `${player.player.first_name} ${player.player.last_name}`
		})) || [];

	// 🧠 Reset selected player when game or team becomes nullish or changes
	useEffect(() => {
		if (!game || !team) {
			setSelectedOption(null);
			setPlayerStatsId('');
		}
	}, [game, team, setPlayerStatsId]);

	const handleChange = (option: SingleValue<OptionType>) => {
		setSelectedOption(option);
		setPlayerStatsId((option?.value as string) || '');
	};

	return (
		<Select
			value={selectedOption}
			onChange={handleChange}
			options={playerStatsOptions}
			placeholder="Select Player"
			styles={selectStyle()}
			isClearable
			isDisabled={!game || !team}
		/>
	);
};

export default PlayerFilter;
