import React from 'react';

import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';
import { PlayerDB } from '@/pages/Player/Player';
import FilterWrapper from '@/pages/Stats/UI/FilterWrapper';

import DatabaseFilter from './DatabaseFilter';
import LeagueFilter from './LeagueFilter';
import LocationFilter from './LocationFilter';
import RoleFilter from './RoleFilter';
import SeasonFilter from './SeasonFilter';

type CoachStatsFilterProps = {
	database: PlayerDB;
	setDatabase: (database: PlayerDB) => void;

	role: null | 'head' | 'assistant';
	setRole: (role: null | 'head' | 'assistant') => void;

	location: 'home' | 'away' | null;
	setLocation: (location: 'home' | 'away' | null) => void;

	league: string | null;
	setLeague: (league: string) => void;

	season: string | null;
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
			<SeasonFilter seasons={seasons} selectedSeason={season} onSeasonChange={setSeason} />
		</FilterWrapper>
	);
};

export default CoachStatsFilter;
