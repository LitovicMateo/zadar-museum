import React from 'react';

import PlayerStatsFilter from '@/components/player-stats/filter/PlayerStatsFilter';
import TeamRecordsTable from '@/components/team-records/TeamRecordsTable';
import { useTeamRecords } from '@/hooks/queries/stats/useTeamRecords';
import { PlayerDB } from '@/pages/Player/Player';
import { SortingState } from '@tanstack/react-table';

import PageWrapper from '../UI/PageWrapper';

const TeamRecords: React.FC = () => {
	// zadar/opponent
	// season
	// league
	// home/away

	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [season, setSeason] = React.useState<string | null>(null);
	const [league, setLeague] = React.useState<string | null>(null);
	const [location, setLocation] = React.useState<'home' | 'away' | null>(null);
	const [sorting, setSorting] = React.useState<SortingState>([{ id: 'score', desc: true }]);

	const { data: stats, isFetching } = useTeamRecords(database, season, league, location, sorting[0]?.id);

	const handleSetDatabase = React.useCallback((db: PlayerDB) => setDatabase(db), []);
	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | null) => setLocation(loc), []);
	const handleSetLeague = React.useCallback((lg: string | null) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string | null) => setSeason(ssn), []);

	return (
		<PageWrapper>
			<PlayerStatsFilter
				database={database}
				setDatabase={handleSetDatabase}
				location={location}
				setLocation={handleSetLocation}
				league={league}
				setLeague={handleSetLeague}
				season={season}
				setSeason={handleSetSeason}
			/>
			{isFetching ? (
				<div>Loading...</div>
			) : (
				<TeamRecordsTable database={database} data={stats} sorting={sorting} setSorting={setSorting} />
			)}
		</PageWrapper>
	);
};

export default TeamRecords;
