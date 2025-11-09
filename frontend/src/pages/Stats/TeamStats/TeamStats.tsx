import React from 'react';

import TeamStatsFilter from '@/components/team-stats/filter/TeamStatsFilter';
import TeamStatsTable from '@/components/team-stats/table/TeamStatsTable';
import { useTeamAllTimeStats } from '@/hooks/queries/stats/useTeamAllTimeStats';
import { useSearch } from '@/hooks/useSearch';
import { searchTeamStats } from '@/utils/search-functions';

import PageWrapper from '../UI/PageWrapper';

const TeamStats: React.FC = () => {
	const [location, setLocation] = React.useState<'home' | 'away' | null>(null);
	const [league, setLeague] = React.useState<string | null>(null);
	const [season, setSeason] = React.useState<string | null>(null);

	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by team name' });

	const { data: allTimeStats, isFetching } = useTeamAllTimeStats(location, league, season);

	const filteredTeams = searchTeamStats(allTimeStats, searchTerm);

	return (
		<PageWrapper>
			<TeamStatsFilter
				location={location}
				setLocation={setLocation}
				league={league}
				setLeague={setLeague}
				season={season}
				setSeason={setSeason}
			/>
			<div className="py-2">{SearchInput}</div>
			<TeamStatsTable stats={filteredTeams} isFetching={isFetching} />
		</PageWrapper>
	);
};

export default TeamStats;
