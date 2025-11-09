import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';

import Category from '../../../pages/Stats/Category';
import Container from '../../../pages/Stats/Container';

type SeasonFilterProps = {
	seasons: string[];
	selectedSeason: string | null;
	onSeasonChange: (season: string) => void;
};
const SeasonFilter: React.FC<SeasonFilterProps> = ({ onSeasonChange, seasons, selectedSeason }) => {
	const seasonOptions: { label: string; value: string }[] = [
		{
			label: 'All',
			value: ''
		},
		...seasons.map((season) => ({
			label: season,
			value: season
		}))
	];

	return (
		<Container>
			<Category>
				<p>Season</p>
			</Category>
			<Select
				styles={selectStyle()}
				value={seasonOptions.find((opt) => opt.value === selectedSeason)}
				onChange={(opt) => onSeasonChange((opt?.value as string) ?? '')}
				options={seasonOptions}
			/>
		</Container>
	);
};

export default SeasonFilter;
