import React from 'react';

import PaginationControls from '@/components/Pagination/PaginationControls';
import TeamStatsFilter from '@/components/Stats/TeamStats/filter/TeamStatsFilter';
import TeamStatsTable from '@/components/Stats/TeamStats/table/TeamStatsTable';
import StatsFilterBar from '@/components/Stats/UI/StatsFilterBar';
import StatsPageHeader from '@/components/Stats/UI/StatsPageHeader';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useTeamAllTimeStats } from '@/hooks/queries/stats/UseTeamAllTimeStats';
import { searchTeamStats } from '@/utils/SearchFunctions';
import { cn } from '@/lib/Utils';
import { SortingState } from '@tanstack/react-table';

const TeamStats: React.FC = () => {
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'games', desc: true }]);

	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by team name' });

	const { data: allTimeStats, isPlaceholderData } = useTeamAllTimeStats(location, league, season);

	const filteredTeams = searchTeamStats(allTimeStats, searchTerm);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filteredTeams, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, location, league, season, JSON.stringify(sorting)]
	});

	return (
		<div className="w-full">
			<StatsPageHeader title="Team stats" count={total} countLabel="teams" />

			<StatsFilterBar searchInput={SearchInput} sheetTitle="Filter teams">
				<TeamStatsFilter
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
					<TeamStatsTable stats={paginated} sorting={sorting} setSorting={setSorting} />
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default TeamStats;
