import React from 'react';
import Select from 'react-select';

import { OptionType, selectStyle } from '@/constants/react-select-style';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';

type SeasonFilterProps = {
	selectedSeason: string;
	setSeason: (season: string) => void;
};

const SeasonFilter: React.FC<SeasonFilterProps> = ({ setSeason, selectedSeason }) => {
	const { data: seasons } = useSeasons();

	if (!seasons) return null;

	const seasonsOptions: OptionType[] = seasons.map((season) => ({ label: season, value: season }));
	return (
		<Select<OptionType>
			value={seasonsOptions?.find((opt) => opt.value === selectedSeason)}
			onChange={(opt) => setSeason(opt?.value as string)}
			options={seasonsOptions}
			styles={selectStyle()}
		/>
	);
};

export default SeasonFilter;
