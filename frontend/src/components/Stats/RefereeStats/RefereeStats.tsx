import React from 'react';

import PaginationControls from '@/components/Pagination/PaginationControls';
import RefereeStatsFilter from '@/components/Stats/RefereeStats/filter/RefereeStatsFilter';
import RefereeStatsTable from '@/components/Stats/RefereeStats/table/RefereeStatsTable';
import StatsFilterBar from '@/components/Stats/UI/StatsFilterBar';
import StatsPageHeader from '@/components/Stats/UI/StatsPageHeader';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useRefereeAllTimeStats } from '@/hooks/queries/stats/UseRefereeAllTimeStats';
import { searchRefereeStats } from '@/utils/SearchFunctions';
import { cn } from '@/lib/Utils';
import { SortingState } from '@tanstack/react-table';

const RefereeStats: React.FC = () => {
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'wins', desc: true }]);

	const { data: refereeAllTime, isPlaceholderData } = useRefereeAllTimeStats(location, league, season);
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by referee name' });

	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | 'all') => setLocation(loc), []);

	const filteredReferees = searchRefereeStats(refereeAllTime, searchTerm);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filteredReferees, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, location, league, season, JSON.stringify(sorting)]
	});

	return (
		<div className="w-full">
			<StatsPageHeader title="Referee stats" count={total} countLabel="referees" />

			<StatsFilterBar searchInput={SearchInput} sheetTitle="Filter referees">
				<RefereeStatsFilter
					location={location}
					setLocation={handleSetLocation}
					league={league}
					setLeague={setLeague}
					season={season}
					setSeason={setSeason}
				/>
			</StatsFilterBar>

			<div className={cn('transition-opacity', isPlaceholderData && 'pointer-events-none opacity-60')}>
				<PaginationControls
					total={total}
					page={page}
					pageSize={pageSize}
					onPageChange={setPage}
					onPageSizeChange={setPageSize}
				/>
				<DynamicContentWrapper>
					<RefereeStatsTable stats={paginated} sorting={sorting} setSorting={setSorting} />
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default RefereeStats;
