import React from 'react';

import PaginationControls from '@/components/pagination/PaginationControls';
import RefereeStatsFilter from '@/components/referee-stats/filter/RefereeStatsFilter';
import RefereeStatsTable from '@/components/referee-stats/table/RefereeStatsTable';
import { useRefereeAllTimeStats } from '@/hooks/queries/stats/useRefereeAllTimeStats';
import usePagedSortedList from '@/hooks/usePagedSortedList';
import { useSearch } from '@/hooks/useSearch';
import { searchRefereeStats } from '@/utils/search-functions';
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
	const handleSetLeague = React.useCallback((lg: string) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string) => setSeason(ssn), []);

	const filteredReferees = searchRefereeStats(refereeAllTime, searchTerm);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filteredReferees, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, location, league, season, JSON.stringify(sorting)]
	});

	return (
		<PageWrapper>
			<RefereeStatsFilter
				location={location}
				setLocation={handleSetLocation}
				league={league}
				setLeague={handleSetLeague}
				season={season}
				setSeason={handleSetSeason}
			/>
			<div className="py-2">{SearchInput}</div>

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
