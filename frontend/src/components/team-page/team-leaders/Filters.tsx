import React from 'react';

import CategorySelect from './CategorySelect';
import CompetitionSelect from './CompetitionSelect';
import RadioButtons from './RadioButtons';
import styles from './Filters.module.css';

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
		<div className={styles.wrapper}>
			<RadioButtons selected={selected} setSelected={setSelected} />
			<div className={styles.controls}>
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
