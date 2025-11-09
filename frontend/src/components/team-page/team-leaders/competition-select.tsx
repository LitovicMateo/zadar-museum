import React from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import { selectStyle } from '@/constants/react-select-style';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useTeamCompetitions } from '@/hooks/queries/team/useTeamCompetitions';

type CompetitionSelectProps = {
	selectedCompetition: string;
	setSelectedCompetition: React.Dispatch<React.SetStateAction<string>>;
};

type Options = {
	value: string;
	label: string;
};

const CompetitionSelect: React.FC<CompetitionSelectProps> = ({ selectedCompetition, setSelectedCompetition }) => {
	const { teamSlug } = useParams();

	const { data: teamCompetitions } = useTeamCompetitions(teamSlug!);
	const { data: competitions } = useCompetitions('slug', 'asc');

	if (!teamCompetitions || !competitions) return null;

	const competitionOptions: Options[] = [
		{
			label: 'All Competitions',
			value: ''
		}
	];

	teamCompetitions.map((c) => {
		const obj = {
			label: competitions.find((comp) => comp.slug === c.league_slug)!.name,
			value: c.league_slug
		};

		competitionOptions.push(obj);
	});

	return (
		<Select
			placeholder="Competition"
			className="text-sm shadow-sm "
			options={competitionOptions}
			value={competitionOptions.find((option) => option.value === selectedCompetition)}
			onChange={(option) => setSelectedCompetition(option?.value.toString() || '')}
			styles={selectStyle('fit-content')}
		/>
	);
};

export default CompetitionSelect;
