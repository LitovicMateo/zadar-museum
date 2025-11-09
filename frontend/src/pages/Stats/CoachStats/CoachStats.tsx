import React from 'react';

import CoachStatsFilter from '@/components/coach-stats/filter/CoachStatsFilter';
import CoachStatsTable from '@/components/coach-stats/table/CoachStatsTable';
import { useCoachAllTimeStats } from '@/hooks/queries/stats/useCoachAllTimeStats';
import { useSearch } from '@/hooks/useSearch';
import { PlayerDB } from '@/pages/Player/Player';
import { searchCoachStats } from '@/utils/search-functions';

import PageWrapper from '../UI/PageWrapper';

const CoachStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [role, setRole] = React.useState<null | 'head' | 'assistant'>(null);
	const [location, setLocation] = React.useState<'home' | 'away' | null>(null);
	const [league, setLeague] = React.useState<string | null>(null);
	const [season, setSeason] = React.useState<string | null>(null);

	const { data: coachAllTimeStats } = useCoachAllTimeStats(database, role, location, league, season);
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search by coach name' });

	const filteredCoaches = searchCoachStats(coachAllTimeStats?.current, searchTerm);

	return (
		<PageWrapper>
			<CoachStatsFilter
				database={database}
				setDatabase={setDatabase}
				role={role}
				setRole={setRole}
				location={location}
				setLocation={setLocation}
				league={league}
				setLeague={setLeague}
				season={season}
				setSeason={setSeason}
			/>
			<div className="py-2">{SearchInput}</div>
			<CoachStatsTable stats={filteredCoaches} prev={coachAllTimeStats?.previous} />
		</PageWrapper>
	);
};

export default CoachStats;
