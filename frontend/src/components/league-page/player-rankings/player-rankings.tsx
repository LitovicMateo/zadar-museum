import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import Heading from '@/components/ui/heading';
import { selectStyle } from '@/constants/react-select-style';
import { PlayerAllTimeStats } from '@/types/api/player';

import LeagueLeaderList from './league-leader-list';
import { rankingOptions } from './ranking-options';

type Option = {
	value: keyof PlayerAllTimeStats;
	label: string;
};

const PlayerRankings: React.FC = () => {
	const { leagueSlug } = useParams();
	const [selectedOption, setSelectedOption] = useState<keyof PlayerAllTimeStats>('points');

	return (
		<section className="flex flex-col gap-4">
			<Heading title="League Leaders" />

			<Select
				value={rankingOptions.find((opt) => opt.value === selectedOption)}
				options={rankingOptions}
				onChange={(opt) => setSelectedOption(opt?.value ?? 'points')}
				styles={selectStyle<Option>()}
			/>
			<LeagueLeaderList leagueSlug={leagueSlug} stat={selectedOption} />
		</section>
	);
};

export default PlayerRankings;
