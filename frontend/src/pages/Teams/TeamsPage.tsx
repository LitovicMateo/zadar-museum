import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import { APP_ROUTES } from '@/constants/Routes';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { useSearch } from '@/hooks/UseSearch';
import { searchTeams } from '@/utils/SearchFunctions';

const TeamsPage: React.FC = () => {
	const { data: teams } = useTeams('short_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!teams) return null;

	if (teams && teams.length === 0) return <NoContent type="info" description="No teams in database." />;

	const filteredTeams = searchTeams(teams, searchTerm);

	return (
		<div>
			{SearchInput}
			<ul>
				{filteredTeams.map((team) => (
					<li key={team.id}>
						<Link to={APP_ROUTES.team(team.slug)}>{team.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TeamsPage;
