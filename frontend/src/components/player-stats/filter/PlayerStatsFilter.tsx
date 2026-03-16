import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import DatabaseFilter from '@/components/shared/filters/DatabaseFilter';
import LeagueFilter from '@/components/shared/filters/LeagueFilter';
import LocationFilter from '@/components/shared/filters/LocationFilter';
import SeasonFilter from '@/components/shared/filters/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';
import FilterWrapper from '@/pages/Stats/UI/FilterWrapper';

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
			<SeasonFilter seasons={seasons} season={season} onSeasonChange={setSeason} />
		</FilterWrapper>
	);
};

export default PlayerStatsFilter;
