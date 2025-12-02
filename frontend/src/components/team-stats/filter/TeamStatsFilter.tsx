import React from 'react';

import LeagueFilter from '@/components/coach-stats/filter/LeagueFilter';
import LocationFilter from '@/components/coach-stats/filter/LocationFilter';
import SeasonFilter from '@/components/coach-stats/filter/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';
import FilterWrapper from '@/pages/Stats/UI/FilterWrapper';

type TeamStatsFilterProps = {
	location: 'home' | 'away' | 'all';
	setLocation: (location: 'home' | 'away' | 'all') => void;
	league: string;
	setLeague: (league: string) => void;
	season: string;
	setSeason: (season: string) => void;
};

const TeamStatsFilter: React.FC<TeamStatsFilterProps> = ({
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
			<SeasonFilter seasons={seasons} selectedSeason={season} onSeasonChange={setSeason} />
		</FilterWrapper>
	);
};

export default TeamStatsFilter;
