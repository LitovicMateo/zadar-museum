import React from 'react';

import CategorySelect from './CategorySelect';
import CompetitionSelect from './CompetitionSelect';
import RadioButtons from './RadioButtons';

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
		<div className="flex flex-col gap-3">
			<RadioButtons selected={selected} setSelected={setSelected} />
			<div className="grid grid-cols-2 gap-3">
				<div>
					<label className="mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
						Competition
					</label>
					<CompetitionSelect
						selectedCompetition={selectedCompetition}
						setSelectedCompetition={setSelectedCompetition}
					/>
				</div>

				<div>
					<label className="mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
						Statistic
					</label>
					<CategorySelect selected={selected} stat={stat} setStat={setStat} />
				</div>
			</div>
		</div>
	);
};

export default Filters;
