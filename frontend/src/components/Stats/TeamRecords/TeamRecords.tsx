import React from 'react';

import MobileFilters from '@/components/MobileFilters/MobileFilters';
import PaginationControls from '@/components/Pagination/PaginationControls';
import { PlayerDB } from '@/components/Player/PlayerPage';
import TeamRecordsTable from '@/components/Stats/TeamRecords/TeamRecordsTable';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useTeamRecords } from '@/hooks/queries/stats/UseTeamRecords';
import { SortingState } from '@tanstack/react-table';

import PlayerStatsFilter from '../PlayerStats/filter/PlayerStatsFilter';
import PageWrapper from '../UI/PageWrapper';

const TeamRecords: React.FC = () => {
	// zadar/opponent
	// season
	// league
	// home/away

	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [season, setSeason] = React.useState<string>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'score', desc: true }]);

	const { data: stats, isFetching } = useTeamRecords(database, season, league, location, sorting[0]?.id);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(stats, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [database, season, league, location, JSON.stringify(sorting)]
	});

	const handleSetDatabase = React.useCallback((db: PlayerDB) => setDatabase(db), []);
	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | 'all') => setLocation(loc), []);
	const handleSetLeague = React.useCallback((lg: string) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string) => setSeason(ssn), []);

	return (
		<PageWrapper>
			<MobileFilters>
				<PlayerStatsFilter
					database={database}
					setDatabase={handleSetDatabase}
					location={location}
					setLocation={handleSetLocation}
					league={league}
					setLeague={handleSetLeague}
					season={season}
					setSeason={handleSetSeason}
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
					<DynamicContentWrapper>
						<TeamRecordsTable
							database={database}
							data={paginated}
							sorting={sorting}
							setSorting={setSorting}
						/>
					</DynamicContentWrapper>
				</>
			)}
		</PageWrapper>
	);
};

export default TeamRecords;
