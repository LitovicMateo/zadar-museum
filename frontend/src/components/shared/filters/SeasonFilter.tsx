import React from 'react';
import Select from 'react-select';

import { selectStyle } from '@/constants/ReactSelectStyle';
import Category from '@/pages/Stats/Category';
import Container from '@/pages/Stats/Container';

type SeasonFilterProps = {
	seasons: string[];
	season: string | null;
	onSeasonChange: (season: string) => void;
};

const SeasonFilter: React.FC<SeasonFilterProps> = ({ seasons, season, onSeasonChange }) => {
	const seasonOptions: { label: string; value: string }[] = [
		{ label: 'All', value: 'all' },
		...seasons.map((s) => ({ label: s, value: s }))
	];

	return (
		<Container>
			<Category>
				<p>Season</p>
			</Category>
			<Select
				styles={selectStyle()}
				value={seasonOptions.find((opt) => opt.value === season) ?? null}
				onChange={(opt) => onSeasonChange((opt?.value as string) ?? 'all')}
				options={seasonOptions}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</Container>
	);
};

export default SeasonFilter;
