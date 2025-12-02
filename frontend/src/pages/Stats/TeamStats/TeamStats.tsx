import React from 'react';

import PaginationControls from '@/components/pagination/PaginationControls';
import TeamStatsFilter from '@/components/team-stats/filter/TeamStatsFilter';
import TeamStatsTable from '@/components/team-stats/table/TeamStatsTable';
import { useTeamAllTimeStats } from '@/hooks/queries/stats/useTeamAllTimeStats';
import usePagedSortedList from '@/hooks/usePagedSortedList';
import { useSearch } from '@/hooks/useSearch';
import { searchTeamStats } from '@/utils/search-functions';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const TeamStats: React.FC = () => {
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'games', desc: true }]);

	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by team name' });

	const { data: allTimeStats, isFetching } = useTeamAllTimeStats(location, league, season);

	const filteredTeams = searchTeamStats(allTimeStats, searchTerm);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filteredTeams, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, location, league, season, JSON.stringify(sorting)]
	});

	return (
		<PageWrapper>
			<TeamStatsFilter
				location={location}
				setLocation={setLocation}
				league={league}
				setLeague={setLeague}
				season={season}
				setSeason={setSeason}
			/>
			<div className="py-2">{SearchInput}</div>

			<PaginationControls
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			<TeamStatsTable stats={paginated} isFetching={isFetching} sorting={sorting} setSorting={setSorting} />
		</PageWrapper>
	);
};

export default TeamStats;
