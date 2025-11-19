import React from 'react';

import RefereeStatsFilter from '@/components/referee-stats/filter/RefereeStatsFilter';
import RefereeStatsTable from '@/components/referee-stats/table/RefereeStatsTable';
import { useRefereeAllTimeStats } from '@/hooks/queries/stats/useRefereeAllTimeStats';
import { useSearch } from '@/hooks/useSearch';
import { searchRefereeStats } from '@/utils/search-functions';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const RefereeStats: React.FC = () => {
	const [location, setLocation] = React.useState<'home' | 'away' | null>(null);
	const [league, setLeague] = React.useState<string | null>(null);
	const [season, setSeason] = React.useState<string | null>(null);
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'wins', desc: true }]);

	const { data: refereeAllTime, isFetching } = useRefereeAllTimeStats(location, league, season);
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by referee name' });

	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | null) => setLocation(loc), []);
	const handleSetLeague = React.useCallback((lg: string | null) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string | null) => setSeason(ssn), []);

	const filteredReferees = searchRefereeStats(refereeAllTime, searchTerm);

	return (
		<PageWrapper>
			<RefereeStatsFilter
				location={location}
				setLocation={handleSetLocation}
				league={league}
				setLeague={handleSetLeague}
				season={season}
				setSeason={handleSetSeason}
			/>
			<div>
				<div className="py-2">{SearchInput}</div>
			</div>
			{isFetching ? (
				<div>Loading...</div>
			) : (
				<RefereeStatsTable stats={filteredReferees} sorting={sorting} setSorting={setSorting} />
			)}
		</PageWrapper>
	);
};

export default RefereeStats;
