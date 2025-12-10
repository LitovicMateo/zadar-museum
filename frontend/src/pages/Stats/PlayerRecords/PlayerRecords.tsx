import React from 'react';

import MobileFilters from '@/components/mobile-filters/MobileFilters';
import PaginationControls from '@/components/pagination/PaginationControls';
import PlayerRecordsTable from '@/components/player-records/PlayerRecordsTable';
import PlayerStatsFilter from '@/components/player-stats/filter/PlayerStatsFilter';
import { usePlayerRecords } from '@/hooks/queries/stats/usePlayerRecords';
import usePagedSortedList from '@/hooks/usePagedSortedList';
import { PlayerDB } from '@/pages/Player/Player';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const PlayerRecords = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [season, setSeason] = React.useState<string>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'points', desc: true }]);

	const { data: stats } = usePlayerRecords(database, season, league, location, sorting[0]?.id);

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
			<PaginationControls
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			<PlayerRecordsTable data={paginated} sorting={sorting} setSorting={setSorting} />
		</PageWrapper>
	);
};

export default PlayerRecords;
