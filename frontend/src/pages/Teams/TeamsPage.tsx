import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import { APP_ROUTES } from '@/constants/routes';
import { useTeams } from '@/hooks/queries/team/useTeams';
import { useSearch } from '@/hooks/useSearch';
import { searchTeams } from '@/utils/search-functions';

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
