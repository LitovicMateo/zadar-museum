import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/no-content';
import { APP_ROUTES } from '@/constants/routes';
import { useCoaches } from '@/hooks/queries/coach/useCoaches';
import { useSearch } from '@/hooks/useSearch';
import { searchCoaches } from '@/utils/search-functions';

const CoachesPage: React.FC = () => {
	const { data: coaches } = useCoaches('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!coaches) return null;

	if (coaches && coaches.length === 0) return <NoContent>No coaches in database.</NoContent>;

	const filteredCoaches = searchCoaches(coaches, searchTerm);
	return (
		<div>
			{SearchInput}
			<ul>
				{filteredCoaches.map((coach) => (
					<li key={coach.id}>
						<Link to={APP_ROUTES.coach(coach.documentId)}>
							{coach.first_name} {coach.last_name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default CoachesPage;
