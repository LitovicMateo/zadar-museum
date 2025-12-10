import React from 'react';

import CoachStatsFilter from '@/components/coach-stats/filter/CoachStatsFilter';
import CoachStatsTable from '@/components/coach-stats/table/CoachStatsTable';
import MobileFilters from '@/components/mobile-filters/MobileFilters';
import PaginationControls from '@/components/pagination/PaginationControls';
import { useCoachAllTimeStats } from '@/hooks/queries/stats/useCoachAllTimeStats';
import usePagedSortedList from '@/hooks/usePagedSortedList';
import { useSearch } from '@/hooks/useSearch';
import { PlayerDB } from '@/pages/Player/Player';
import { searchCoachStats } from '@/utils/search-functions';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const CoachStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [role, setRole] = React.useState<'all' | 'head' | 'assistant'>('all');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'wins', desc: true }]);

	const { data: coachAllTimeStats } = useCoachAllTimeStats(database, role, location, league, season);
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by coach name' });

	const filteredCoaches = searchCoachStats(coachAllTimeStats?.current, searchTerm);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filteredCoaches, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, database, role, location, league, season, JSON.stringify(sorting)]
	});

	const paginatedPrev = coachAllTimeStats?.previous
		? coachAllTimeStats.previous.filter((p) =>
				paginated?.some(
					(pp) => (pp as Record<string, unknown>)['player_id'] === (p as Record<string, unknown>)['player_id']
				)
			)
		: undefined;

	return (
		<PageWrapper>
			<MobileFilters SearchInput={SearchInput}>
				<CoachStatsFilter
					database={database}
					setDatabase={setDatabase}
					role={role}
					setRole={setRole}
					location={location}
					setLocation={setLocation}
					league={league}
					setLeague={setLeague}
					season={season}
					setSeason={setSeason}
				/>
			</MobileFilters>

			<PaginationControls
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			<CoachStatsTable stats={paginated} prev={paginatedPrev} sorting={sorting} setSorting={setSorting} />
		</PageWrapper>
	);
};

export default CoachStats;
