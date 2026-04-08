import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';
import FilterWrapper from '@/components/Stats/UI/FilterWrapper';
import DatabaseFilter from '@/components/shared/filters/DatabaseFilter';
import LeagueFilter from '@/components/shared/filters/LeagueFilter';
import LocationFilter from '@/components/shared/filters/LocationFilter';
import SeasonFilter from '@/components/shared/filters/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';

import RoleFilter from './RoleFilter';

type CoachStatsFilterProps = {
	database: PlayerDB;
	setDatabase: (database: PlayerDB) => void;

	role: 'all' | 'head' | 'assistant';
	setRole: (role: 'all' | 'head' | 'assistant') => void;

	location: 'home' | 'away' | 'all';
	setLocation: (location: 'home' | 'away' | 'all') => void;

	league: string;
	setLeague: (league: string) => void;

	season: string;
	setSeason: (season: string) => void;
};

const CoachStatsFilter: React.FC<CoachStatsFilterProps> = ({
	database,
	setDatabase,
	role,
	setRole,
	location,
	setLocation,
	league,
	setLeague,
	season,
	setSeason
}) => {
	const { data: seasons } = useSeasons();
	const { data: competitions } = useCompetitions('slug', 'asc');

	if (!seasons || !competitions) return null;

	return (
		<FilterWrapper>
			<DatabaseFilter database={database} setDatabase={setDatabase} />
			<RoleFilter role={role} setRole={setRole} />
			<LocationFilter location={location} setLocation={setLocation} />
			<LeagueFilter league={league} setLeague={setLeague} competitions={competitions} />
			<SeasonFilter seasons={seasons} season={season} onSeasonChange={setSeason} />
		</FilterWrapper>
	);
};

export default CoachStatsFilter;
