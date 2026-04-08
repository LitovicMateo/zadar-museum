import React from 'react';
import Select from 'react-select';

import Category from '@/components/Stats/Category';
import Container from '@/components/Stats/Container';
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
		<Container>
			<Category>League</Category>
			<Select
				styles={selectStyle()}
				options={leagueOptions}
				value={leagueOptions.find((opt) => opt.value === league) ?? null}
				onChange={(opt) => setLeague((opt?.value as string) ?? 'all')}
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
		</Container>
	);
};

export default LeagueFilter;
