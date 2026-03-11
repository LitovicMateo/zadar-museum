import React from 'react';

import MobileFilters from '@/components/mobile-filters/MobileFilters';
import PaginationControls from '@/components/pagination/PaginationControls';
import RefereeStatsFilter from '@/components/referee-stats/filter/RefereeStatsFilter';
import RefereeStatsTable from '@/components/referee-stats/table/RefereeStatsTable';
import { useRefereeAllTimeStats } from '@/hooks/queries/stats/UseRefereeAllTimeStats';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { searchRefereeStats } from '@/utils/SearchFunctions';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const RefereeStats: React.FC = () => {
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'wins', desc: true }]);

	const { data: refereeAllTime, isFetching } = useRefereeAllTimeStats(location, league, season);
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by referee name' });

	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | 'all') => setLocation(loc), []);

	const filteredReferees = searchRefereeStats(refereeAllTime, searchTerm);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filteredReferees, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, location, league, season, JSON.stringify(sorting)]
	});

	return (
		<PageWrapper>
			<MobileFilters SearchInput={SearchInput}>
				<RefereeStatsFilter
					location={location}
					setLocation={handleSetLocation}
					league={league}
					setLeague={setLeague}
					season={season}
					setSeason={setSeason}
				/>
			</MobileFilters>

			{isFetching ? (
				<div>Loading...</div>
			) : (
				<>
					<PaginationControls
						total={total}
						page={page}
						pageSize={pageSize}
						onPageChange={setPage}
						onPageSizeChange={setPageSize}
					/>
					<RefereeStatsTable stats={paginated} sorting={sorting} setSorting={setSorting} />
				</>
			)}
		</PageWrapper>
	);
};

export default RefereeStats;
