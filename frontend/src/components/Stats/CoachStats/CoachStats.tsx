import React from 'react';

import PaginationControls from '@/components/Pagination/PaginationControls';
import { PlayerDB } from '@/components/Player/PlayerPage';
import CoachStatsFilter from '@/components/Stats/CoachStats/filter/CoachStatsFilter';
import CoachStatsTable from '@/components/Stats/CoachStats/table/CoachStatsTable';
import StatsFilterBar from '@/components/Stats/UI/StatsFilterBar';
import StatsPageHeader from '@/components/Stats/UI/StatsPageHeader';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useCoachAllTimeStats } from '@/hooks/queries/stats/UseCoachAllTimeStats';
import { searchCoachStats } from '@/utils/SearchFunctions';
import { cn } from '@/lib/Utils';
import { SortingState } from '@tanstack/react-table';

const CoachStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('main');
	const [role, setRole] = React.useState<'all' | 'head' | 'assistant'>('all');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'wins', desc: true }]);

	const { data: coachAllTimeStats, isPlaceholderData } = useCoachAllTimeStats(database, role, location, league, season);
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
		<div className="w-full">
			<StatsPageHeader title="Coach stats" count={total} countLabel="coaches" />

			<StatsFilterBar searchInput={SearchInput} sheetTitle="Filter coaches">
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
					<CoachStatsTable stats={paginated} prev={paginatedPrev} sorting={sorting} setSorting={setSorting} />
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default CoachStats;
