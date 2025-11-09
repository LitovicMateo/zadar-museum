import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useVenues } from '@/hooks/queries/venue/useVenues';
import { useSearch } from '@/hooks/useSearch';
import { searchVenues } from '@/utils/search-functions';

const VenuesPage: React.FC = () => {
	const { data: venues } = useVenues('slug', 'desc');
	const { SearchInput, searchTerm } = useSearch({
		className: 'max-w-[200px]'
	});

	if (!venues) return null;

	if (venues && venues.length === 0) return <div>No venues in database.</div>;

	const filteredVenues = searchVenues(venues, searchTerm);

	return (
		<div>
			{SearchInput}
			<ul>
				{filteredVenues.map((venue) => (
					<li key={venue.id}>
						<Link to={APP_ROUTES.venue(venue.slug)}>{venue.name}</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default VenuesPage;
