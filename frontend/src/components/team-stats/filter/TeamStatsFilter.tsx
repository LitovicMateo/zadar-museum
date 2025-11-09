import React from 'react';

import LeagueFilter from '@/components/coach-stats/filter/LeagueFilter';
import LocationFilter from '@/components/coach-stats/filter/LocationFilter';
import SeasonFilter from '@/components/coach-stats/filter/SeasonFilter';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { useSeasons } from '@/hooks/queries/dasboard/useSeasons';
import FilterWrapper from '@/pages/Stats/UI/FilterWrapper';

type TeamStatsFilterProps = {
	location: 'home' | 'away' | null;
	setLocation: (location: 'home' | 'away' | null) => void;
	league: string | null;
	setLeague: (league: string | null) => void;
	season: string | null;
	setSeason: (season: string | null) => void;
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
