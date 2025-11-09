import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useReferees } from '@/hooks/queries/referee/useReferees';
import { useSearch } from '@/hooks/useSearch';
import { searchReferees } from '@/utils/search-functions';

const RefereesPage: React.FC = () => {
	const { data: referees } = useReferees('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({ className: 'max-w-[200px]' });

	if (!referees) return null;
	const filteredReferees = searchReferees(referees, searchTerm);

	return (
		<div>
			{SearchInput}
			<ul>
				{filteredReferees.map((referee) => (
					<li key={referee.id}>
						<Link to={APP_ROUTES.referee(referee.documentId)}>
							{referee.first_name} {referee.last_name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RefereesPage;
