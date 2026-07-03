import React from 'react';
import AppSelect from '@/components/forms/shared/AppSelect';

import FilterField from '@/components/Stats/UI/FilterField';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { CompetitionDetailsResponse } from '@/types/api/Competition';

type LeagueFilterProps = {
	league: string | null;
	setLeague: (league: string) => void;
	competitions: CompetitionDetailsResponse[];
};

const LeagueFilter: React.FC<LeagueFilterProps> = ({ league, setLeague, competitions }) => {
	const leagueOptions: { label: string; value: string }[] = [
		{ label: 'All', value: 'all' },
		...competitions.map((comp) => ({ label: comp.name, value: comp.slug }))
	];

	return (
		<FilterField label="League">
			<AppSelect
				styles={selectStyle()}
				options={leagueOptions}
				value={leagueOptions.find((opt) => opt.value === league) ?? null}
				onChange={(opt) => setLeague((opt?.value as string) ?? 'all')}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</FilterField>
	);
};

export default LeagueFilter;
