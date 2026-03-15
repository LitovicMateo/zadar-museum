import React from 'react';
import { Link } from 'react-router-dom';

import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { APP_ROUTES } from '@/constants/Routes';
import { useSearch } from '@/hooks/UseSearch';
import { useReferees } from '@/hooks/queries/referee/UseReferees';
import { searchReferees } from '@/utils/SearchFunctions';

const RefereesPage: React.FC = () => {
	const { data: referees } = useReferees('last_name', 'asc');
	const { SearchInput, searchTerm } = useSearch({ className: 'max-w-[200px]' });

	if (!referees) return null;
	const filteredReferees = searchReferees(referees, searchTerm);

	return (
		<div>
			{SearchInput}
			<DynamicContentWrapper>
				<ul>
					{filteredReferees.map((referee) => (
						<li key={referee.id}>
							<Link to={APP_ROUTES.referee(referee.documentId)}>
								{referee.first_name} {referee.last_name}
							</Link>
						</li>
					))}
				</ul>
			</DynamicContentWrapper>
		</div>
	);
};

export default RefereesPage;
