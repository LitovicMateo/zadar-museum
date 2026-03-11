import React, { useEffect, useState } from 'react';
import Select, { SingleValue } from 'react-select';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { useSeasonCompetitions } from '@/hooks/queries/dasboard/UseSeasonCompetitions';

type CompetitionFilterProps = {
	season: string;
	setLeague: React.Dispatch<React.SetStateAction<string>>;
};

const CompetitionFilter: React.FC<CompetitionFilterProps> = ({ season, setLeague }) => {
	const { data: competitions } = useSeasonCompetitions(season);
	const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

	const competitionsOptions: OptionType[] =
		competitions?.map((c) => ({
			value: c.league_id,
			label: c.league_name
		})) || [];

	// 🧠 Reset selected option if season becomes null
	useEffect(() => {
		if (!season) {
			setSelectedOption(null);
			setLeague(''); // clear league state as well
		}
	}, [season, setLeague]);

	const handleChange = (option: SingleValue<OptionType>) => {
		setSelectedOption(option);
		setLeague(option?.value?.toString() || '');
	};

	return (
		<Select
			value={selectedOption}
			onChange={handleChange}
			placeholder="Select Competition"
			options={competitionsOptions}
			isClearable
			isDisabled={!season}
			styles={selectStyle()}
		/>
	);
};

export default CompetitionFilter;
