import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { CoachStatsRanking } from '@/types/api/Coach';

import { coachRankingOptions } from './CoachRankingOptions';
import LeagueCoachLeaderList from './LeagueCoachLeaderList';

import styles from './CoachRankings.module.css';

type Option = {
	value: keyof CoachStatsRanking;
	label: string;
};

const LeagueCoachRankings: React.FC = () => {
	const { leagueSlug } = useParams();
	const [selectedOption, setSelectedOption] = useState<keyof CoachStatsRanking>('games');

	return (
		<section className={styles.section}>
			<Select
				value={coachRankingOptions.find((opt) => opt.value === selectedOption)}
				options={coachRankingOptions}
				onChange={(opt) => setSelectedOption(opt?.value ?? 'games')}
				styles={selectStyle<Option>()}
			/>
			<DynamicContentWrapper>
				<LeagueCoachLeaderList leagueSlug={leagueSlug} stat={selectedOption} />
			</DynamicContentWrapper>
		</section>
	);
};

export default LeagueCoachRankings;
