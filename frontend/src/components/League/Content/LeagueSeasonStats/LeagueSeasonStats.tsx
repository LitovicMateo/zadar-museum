import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { Skeleton } from '@/components/UI/Skeleton';
import { StatsTable, type StatsColumn, type StatsDataRow, type StatsGroup } from '@/components/UI/stats-table';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { useTeamLeagueSeasonStats } from '@/hooks/queries/league/UseTeamLeagueStats';
import { TeamStats } from '@/types/api/Team';

import LeagueFinalStandings from './LeagueFinalStandings';
import SeasonLeaders from './SeasonLeaders';
import SeasonTeamRecords from './SeasonTeamRecords';

const fmt = (v: number | string | null | undefined): string => (v == null ? '–' : `${v}`);

const leagueSeasonColumns: StatsColumn<TeamStats>[] = [
	{
		id: 'key',
		header: '',
		cell: (r) => r.key,
		meta: { sticky: 'left', stickyOffset: '0' }
	},
	{
		id: 'games',
		header: 'GP',
		cell: (r) => fmt(r.games),
		sortValue: (r) => r.games
	},
	{
		id: 'wins',
		header: 'W',
		cell: (r) => fmt(r.wins),
		sortValue: (r) => r.wins
	},
	{
		id: 'losses',
		header: 'L',
		cell: (r) => fmt(r.losses),
		sortValue: (r) => r.losses
	},
	{
		id: 'win_percentage',
		header: 'W%',
		cell: (r) => (r.win_percentage != null ? `${r.win_percentage}%` : '–'),
		sortValue: (r) => r.win_percentage
	},
	{
		id: 'points_scored',
		header: 'PTS S',
		cell: (r) => fmt(r.points_scored),
		sortValue: (r) => r.points_scored
	},
	{
		id: 'points_received',
		header: 'PTS R',
		cell: (r) => fmt(r.points_received),
		sortValue: (r) => r.points_received
	},
	{
		id: 'points_diff',
		header: '+/-',
		cell: (r) => {
			if (r.points_diff == null) return '–';
			return r.points_diff > 0 ? `+${r.points_diff}` : `${r.points_diff}`;
		},
		sortValue: (r) => r.points_diff
	},
	{
		id: 'attendance',
		header: 'ATT',
		cell: (r) => fmt(r.attendance),
		sortValue: (r) => r.attendance
	}
];

const LeagueSeasonStats: React.FC = () => {
	const { leagueSlug } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState<string>('');

	const { data: seasons } = useLeagueSeasons(leagueSlug!);
	const { data: teamStats, isLoading } = useTeamLeagueSeasonStats(leagueSlug!, selectedSeason);

	useEffect(() => {
		if (seasons) setSelectedSeason(seasons[0]);
	}, [seasons]);

	const groups = useMemo<StatsGroup<TeamStats>[]>(() => {
		if (!teamStats || teamStats.length === 0) return [];
		const stats = teamStats[0].stats;
		const rows: StatsDataRow<TeamStats>[] = [
			{ key: 'home', data: stats.home },
			{ key: 'away', data: stats.away }
		];
		if (stats.neutral) rows.push({ key: 'neutral', data: stats.neutral });
		return [{ key: 'season', rows }];
	}, [teamStats]);

	const footerRows = useMemo<StatsDataRow<TeamStats>[]>(() => {
		if (!teamStats || teamStats.length === 0) return [];
		return [{ key: 'total', data: teamStats[0].stats.total }];
	}, [teamStats]);

	if (!seasons) return null;

	return (
		<div className="space-y-8">
			<SeasonSelect
				compact
				seasons={seasons}
				selectedSeason={selectedSeason}
				onSeasonChange={setSelectedSeason}
			/>

			{isLoading ? (
				<Skeleton className="h-32 rounded-xl" />
			) : (
				<StatsTable
					columns={leagueSeasonColumns}
					groups={groups}
					footer={{ rows: footerRows, variant: 'light' }}
					initialSort={{ columnId: 'games', dir: 'desc' }}
				/>
			)}

			{selectedSeason && (
				<>
					<LeagueFinalStandings leagueSlug={leagueSlug!} season={selectedSeason} />
					<SeasonLeaders leagueSlug={leagueSlug!} season={selectedSeason} />
					<SeasonTeamRecords leagueSlug={leagueSlug!} season={selectedSeason} />
				</>
			)}
		</div>
	);
};

export default LeagueSeasonStats;
