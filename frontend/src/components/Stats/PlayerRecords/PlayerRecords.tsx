import React from 'react';

import PaginationControls from '@/components/Pagination/PaginationControls';
import { PlayerDB } from '@/components/Player/PlayerPage';
import PlayerRecordsTable from '@/components/Stats/PlayerRecords/PlayerRecordsTable';
import StatsFilterBar from '@/components/Stats/UI/StatsFilterBar';
import StatsPageHeader from '@/components/Stats/UI/StatsPageHeader';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { usePlayerRecords } from '@/hooks/queries/stats/UsePlayerRecords';
import { cn } from '@/lib/Utils';
import { SortingState } from '@tanstack/react-table';

import PlayerStatsFilter from '../PlayerStats/filter/PlayerStatsFilter';

const PlayerRecords = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('main');
	const [season, setSeason] = React.useState<string>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'points', desc: true }]);

	const { data: stats, isPlaceholderData } = usePlayerRecords(database, season, league, location, sorting[0]?.id);

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
		<div className="w-full">
			<StatsPageHeader title="Player records" count={total} countLabel="records" />

			<StatsFilterBar sheetTitle="Filter records">
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
					<PlayerRecordsTable data={paginated} sorting={sorting} setSorting={setSorting} />
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default PlayerRecords;
