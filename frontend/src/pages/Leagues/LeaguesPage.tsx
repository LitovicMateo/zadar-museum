import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import { APP_ROUTES } from '@/constants/routes';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useSearch } from '@/hooks/useSearch';
import { searchLeagues } from '@/utils/search-functions';

const LeaguesPage: React.FC = () => {
	const { data: leagues } = useCompetitions('name', 'asc');
	const { searchTerm, SearchInput } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!leagues) return null;

	if (leagues && leagues.length === 0) return <NoContent>No leagues in database.</NoContent>;

	const filteredLeagues = searchLeagues(leagues, searchTerm);

	return (
		<div>
			{SearchInput}
			<ul>
				{filteredLeagues.map((league) => (
					<li key={league.id}>
						<Link to={APP_ROUTES.league(league.slug)}>{league.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default LeaguesPage;
