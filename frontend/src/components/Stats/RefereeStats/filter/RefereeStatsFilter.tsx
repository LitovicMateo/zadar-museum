import React from 'react';

import FilterWrapper from '@/components/Stats/UI/FilterWrapper';
import LeagueFilter from '@/components/shared/filters/LeagueFilter';
import LocationFilter from '@/components/shared/filters/LocationFilter';
import SeasonFilter from '@/components/shared/filters/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/UseSeasons';

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
			<SeasonFilter seasons={seasons} season={season} onSeasonChange={setSeason} />
		</FilterWrapper>
	);
};

export default RefereeStatsFilter;
