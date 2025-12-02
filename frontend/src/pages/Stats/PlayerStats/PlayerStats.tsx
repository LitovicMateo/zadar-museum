import React from 'react';

import PaginationControls from '@/components/pagination/PaginationControls';
import PlayerStatsFilter from '@/components/player-stats/filter/PlayerStatsFilter';
import PlayerStatsTable from '@/components/player-stats/table/PlayerStatsTable';
import { usePlayerAllTimeStats } from '@/hooks/queries/stats/usePlayerAllTimeStats';
import usePagedSortedList from '@/hooks/usePagedSortedList';
import { useSearch } from '@/hooks/useSearch';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerAllTimeStats } from '@/types/api/player';
import { searchPlayerStats } from '@/utils/search-functions';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const PlayerStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
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

	const { data: players } = usePlayerAllTimeStats(database, stats, location, league, season);
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
		<PageWrapper>
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
			<div className="py-2">{SearchInput}</div>

			<PaginationControls
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			<PlayerStatsTable stats={paginatedPlayers} prev={paginatedPrev} sorting={sorting} setSorting={setSorting} />
		</PageWrapper>
	);
};

export default PlayerStats;
