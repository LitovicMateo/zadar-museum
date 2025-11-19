import React from 'react';

import PlayerStatsFilter from '@/components/player-stats/filter/PlayerStatsFilter';
import PlayerStatsTable from '@/components/player-stats/table/PlayerStatsTable';
import { usePlayerAllTimeStats } from '@/hooks/queries/stats/usePlayerAllTimeStats';
import { useSearch } from '@/hooks/useSearch';
import { PlayerDB } from '@/pages/Player/Player';
import { searchPlayerStats } from '@/utils/search-functions';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const PlayerStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [stats, setStats] = React.useState<'total' | 'average'>('total');
	const [location, setLocation] = React.useState<'home' | 'away' | null>(null);
	const [league, setLeague] = React.useState<string | null>(null);
	const [season, setSeason] = React.useState<string | null>(null);

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

	const handleSetDatabase = React.useCallback((db: PlayerDB) => setDatabase(db), []);
	const handleSetStats = React.useCallback((s: 'total' | 'average') => setStats(s), []);
	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | null) => setLocation(loc), []);
	const handleSetLeague = React.useCallback((lg: string | null) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string | null) => setSeason(ssn), []);

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

			<PlayerStatsTable
				stats={filteredPlayers}
				prev={players?.previous}
				sorting={sorting}
				setSorting={setSorting}
			/>
		</PageWrapper>
	);
};

export default PlayerStats;
