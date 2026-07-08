import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { CoachStatsRanking } from '@/types/api/Coach';

import { coachRankingOptions } from './CoachRankingOptions';
import LeagueCoachLeaderList from './LeagueCoachLeaderList';

type Option = {
	value: keyof CoachStatsRanking;
	label: string;
};

const LeagueCoachRankings: React.FC = () => {
	const { leagueSlug } = useParams();
	const [selectedOption, setSelectedOption] = useState<keyof CoachStatsRanking>('games');

	return (
		<section className="space-y-4">
			<AppSelect
				value={coachRankingOptions.find((opt) => opt.value === selectedOption)}
				options={coachRankingOptions}
				onChange={(opt) => setSelectedOption(opt?.value ?? 'games')}
				styles={selectStyle<Option>()}
			/>
			<LeagueCoachLeaderList leagueSlug={leagueSlug} stat={selectedOption} />
		</section>
	);
};

export default LeagueCoachRankings;
