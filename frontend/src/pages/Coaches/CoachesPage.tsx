import React from 'react';
import { Link } from 'react-router-dom';

import NoContent from '@/components/no-content/NoContent';
import { APP_ROUTES } from '@/constants/Routes';
import { useCoaches } from '@/hooks/queries/coach/UseCoaches';
import { useSearch } from '@/hooks/UseSearch';
import { searchCoaches } from '@/utils/SearchFunctions';

const CoachesPage: React.FC = () => {
	const { data: coaches } = useCoaches('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!coaches) return null;

	if (coaches && coaches.length === 0) return <NoContent type="info" description="No coaches in database." />;

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
