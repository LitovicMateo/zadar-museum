import React from 'react';

import PaginationControls from '@/components/Pagination/PaginationControls';
import { PlayerDB } from '@/components/Player/PlayerPage';
import PlayerStatsTable from '@/components/Stats/PlayerStats/table/PlayerStatsTable';
import StatsFilterBar from '@/components/Stats/UI/StatsFilterBar';
import StatsPageHeader from '@/components/Stats/UI/StatsPageHeader';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { usePlayerAllTimeStats } from '@/hooks/queries/stats/UsePlayerAllTimeStats';
import { PlayerAllTimeStats } from '@/types/api/Player';
import { searchPlayerStats } from '@/utils/SearchFunctions';
import { cn } from '@/lib/Utils';
import { SortingState } from '@tanstack/react-table';

import PlayerStatsFilter from './filter/PlayerStatsFilter';

const PlayerStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('main');
	const [stats, setStats] = React.useState<'total' | 'average'>('total');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');

	const [sorting, setSorting] = React.useState<SortingState>([
		{
			id: 'points',
			desc: true
		}
	]);

	const { SearchInput, searchTerm } = useSearch({
		placeholder: 'Search by player name'
	});

	const { data: players, isPlaceholderData } = usePlayerAllTimeStats(database, stats, location, league, season);
	const filteredPlayers = searchPlayerStats(players?.current, searchTerm);

	const {
		paginated: paginatedPlayers,
		total,
		page,
		pageSize,
		setPage,
		setPageSize
	} = usePagedSortedList<PlayerAllTimeStats>(filteredPlayers, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, database, stats, location, league, season, JSON.stringify(sorting)]
	});

	// Filter previous dataset to only include players visible on current page
	const paginatedPrev = players?.previous
		? players.previous.filter((p) =>
				paginatedPlayers?.some((pp: PlayerAllTimeStats) => pp.player_id === p.player_id)
			)
		: undefined;

	const handleSetDatabase = React.useCallback((db: PlayerDB) => setDatabase(db), []);
	const handleSetStats = React.useCallback((s: 'total' | 'average') => setStats(s), []);
	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | 'all') => setLocation(loc), []);
	const handleSetLeague = React.useCallback((lg: string) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string) => setSeason(ssn), []);

	return (
		<div className="w-full">
			<StatsPageHeader title="Player stats" count={total} countLabel="players" />

			<StatsFilterBar searchInput={SearchInput} sheetTitle="Filter players">
				<PlayerStatsFilter
					database={database}
					setDatabase={handleSetDatabase}
					stats={stats}
					setStats={handleSetStats}
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
					<PlayerStatsTable
						stats={paginatedPlayers}
						prev={paginatedPrev}
						sorting={sorting}
						setSorting={setSorting}
					/>
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default PlayerStats;
