import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import CoachStatsFilter from '@/components/coach-stats/filter/CoachStatsFilter';
import CoachStatsTable from '@/components/coach-stats/table/CoachStatsTable';
import MobileFilters from '@/components/mobile-filters/MobileFilters';
import PaginationControls from '@/components/pagination/PaginationControls';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useCoachAllTimeStats } from '@/hooks/queries/stats/UseCoachAllTimeStats';
import { searchCoachStats } from '@/utils/SearchFunctions';
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
			<DynamicContentWrapper>
				<CoachStatsTable stats={paginated} prev={paginatedPrev} sorting={sorting} setSorting={setSorting} />
			</DynamicContentWrapper>
		</PageWrapper>
	);
};

export default CoachStats;
