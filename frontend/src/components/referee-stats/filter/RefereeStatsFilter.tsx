import React from 'react';

import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';
import FilterWrapper from '@/pages/Stats/UI/FilterWrapper';

import LeagueFilter from './LeagueFilter';
import LocationFilter from './LocationFilter';
import SeasonFilter from './SeasonFilter';

type RefereeStatsFilterProps = {
	location: 'home' | 'away' | 'all';
	setLocation: (location: 'home' | 'away' | 'all') => void;
	league: string;
	setLeague: (league: string) => void;
	season: string;
	setSeason: (season: string) => void;
};

const RefereeStatsFilter: React.FC<RefereeStatsFilterProps> = ({
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
			<LocationFilter location={location} setLocation={setLocation} />
			<LeagueFilter competitions={competitions} league={league} setLeague={setLeague} />
			<SeasonFilter seasons={seasons} season={season} setSeason={setSeason} />
		</FilterWrapper>
	);
};

export default RefereeStatsFilter;
