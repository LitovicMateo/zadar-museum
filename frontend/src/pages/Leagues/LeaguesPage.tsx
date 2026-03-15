import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useSearch } from '@/hooks/UseSearch';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { searchLeagues } from '@/utils/SearchFunctions';

const LeaguesPage: React.FC = () => {
	const { data: leagues } = useCompetitions('name', 'asc');
	const { searchTerm, SearchInput } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!leagues) return null;

	if (leagues && leagues.length === 0) return <NoContent type="info" description="No leagues in database." />;

	const filteredLeagues = searchLeagues(leagues, searchTerm);

	return (
		<div>
			{SearchInput}
			<DynamicContentWrapper>
				<ul>
					{filteredLeagues.map((league) => (
						<li key={league.id}>
							<Link to={APP_ROUTES.league(league.slug)}>{league.name}</Link>
						</li>
					))}
				</ul>
			</DynamicContentWrapper>
		</div>
	);
};

export default LeaguesPage;
