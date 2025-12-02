import React from 'react';

import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';
import { PlayerDB } from '@/pages/Player/Player';
import FilterWrapper from '@/pages/Stats/UI/FilterWrapper';

import DatabaseFilter from './DatabaseFilter';
import LeagueFilter from './LeagueFilter';
import LocationFilter from './LocationFilter';
import SeasonFilter from './SeasonFilter';
import StatsFilter from './StatsFilter';

type PlayerStatsFilterProps = {
	database: PlayerDB;
	stats?: 'total' | 'average';
	location: 'home' | 'away' | 'all';
	league: string;
	season: string;

	setDatabase: (database: PlayerDB) => void;
	setStats?: (stats: 'total' | 'average') => void;
	setLocation: (location: 'home' | 'away' | 'all') => void;
	setLeague: (league: string) => void;
	setSeason: (season: string) => void;
};

const PlayerStatsFilter: React.FC<PlayerStatsFilterProps> = ({
	database,
	stats,
	location,
	league,
	season,
	setDatabase,
	setStats,
	setLocation,
	setLeague,
	setSeason
}) => {
	const { data: seasons } = useSeasons();
	const { data: competitions } = useCompetitions('slug', 'asc');

	if (!seasons || !competitions) return null;

	return (
		<FilterWrapper>
			<DatabaseFilter database={database} setDatabase={setDatabase} />
			{stats && <StatsFilter stats={stats} setStats={setStats} />}
			<LocationFilter location={location} setLocation={setLocation} />
			<LeagueFilter league={league} setLeague={setLeague} competitions={competitions} />
			<SeasonFilter seasons={seasons} selectedSeason={season} onSeasonChange={setSeason} />
		</FilterWrapper>
	);
};

export default PlayerStatsFilter;
