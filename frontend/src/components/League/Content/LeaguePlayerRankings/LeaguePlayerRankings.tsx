import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { PlayerAllTimeStats } from '@/types/api/Player';

import LeagueLeaderList from './LeagueLeaderList';
import { rankingOptions } from './RankingOptions';

import styles from './PlayerRankings.module.css';

type Option = {
	value: keyof PlayerAllTimeStats;
	label: string;
};

const LeaguePlayerRankings: React.FC = () => {
	const { leagueSlug } = useParams();
	const [selectedOption, setSelectedOption] = useState<keyof PlayerAllTimeStats>('points');

	return (
		<section className={styles.section}>
			<Select
				value={rankingOptions.find((opt) => opt.value === selectedOption)}
				options={rankingOptions}
				onChange={(opt) => setSelectedOption(opt?.value ?? 'points')}
				styles={selectStyle<Option>()}
			/>
			<DynamicContentWrapper>
				<LeagueLeaderList leagueSlug={leagueSlug} stat={selectedOption} />
			</DynamicContentWrapper>
		</section>
	);
};

export default LeaguePlayerRankings;
