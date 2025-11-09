import React from 'react';

import CategorySelect from './category-select';
import CompetitionSelect from './competition-select';
import RadioButtons from './radio-buttons';

type FiltersProps = {
	selected: 'player' | 'coach';
	setSelected: React.Dispatch<React.SetStateAction<'player' | 'coach'>>;
	stat: string | null;
	setStat: React.Dispatch<React.SetStateAction<string | null>>;
	selectedCompetition: string;
	setSelectedCompetition: React.Dispatch<React.SetStateAction<string>>;
};

const Filters: React.FC<FiltersProps> = ({
	selected,
	setSelected,
	stat,
	setStat,
	selectedCompetition,
	setSelectedCompetition
}) => {
	return (
		<div className="flex justify-between items-center">
			<RadioButtons selected={selected} setSelected={setSelected} />
			<div className="flex gap-4 w-full justify-end items-center">
				<CompetitionSelect
					selectedCompetition={selectedCompetition}
					setSelectedCompetition={setSelectedCompetition}
				/>

				<CategorySelect selected={selected} stat={stat} setStat={setStat} />
			</div>
		</div>
	);
};

export default Filters;
