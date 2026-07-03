import type { FC } from 'react';
import { Link } from 'react-router-dom';

import type { StatsColumn } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import { TeamStats } from '@/types/api/Team';

export const TeamLeagueCell: FC<{ leagueSlug?: string | null }> = ({ leagueSlug }) => {
	const { data: league } = useLeagueDetails(leagueSlug || '');
	if (!leagueSlug) return <p>Total</p>;
	return <Link to={APP_ROUTES.league(leagueSlug)}>{league?.name || ''}</Link>;
};

const show = (v: unknown) => (v === null || v === undefined ? '-' : String(v));

const num = (id: string, header: string, key: keyof TeamStats): StatsColumn<TeamStats> => ({
	id,
	header,
	cell: (row) => show(row[key]),
	sortValue: (row) => {
		const v = row[key];
		return v === null || v === undefined ? null : Number(v);
	},
	sortDescFirst: true,
});

/** Point-differential column: green when positive, red when negative. */
const diff = (id: string, header: string, key: keyof TeamStats): StatsColumn<TeamStats> => ({
	...num(id, header, key),
	cell: (row) => {
		const v = row[key];
		if (v === null || v === undefined) return '-';
		const n = Number(v);
		const tone = n > 0 ? 'text-positive' : n < 0 ? 'text-negative' : undefined;
		return <span className={tone}>{String(v)}</span>;
	},
});

/** Columns for the team league / season stats tables. */
export const teamStatsColumns: StatsColumn<TeamStats>[] = [
	{
		id: 'league',
		header: 'League',
		cell: (row) => <TeamLeagueCell leagueSlug={row.league_slug} />,
		meta: { sticky: 'left', stickyOffset: '0' },
	},
	num('games', 'GP', 'games'),
	num('wins', 'W', 'wins'),
	num('losses', 'L', 'losses'),
	num('win_percentage', 'W%', 'win_percentage'),
	num('points_scored', 'PTS S', 'points_scored'),
	num('points_received', 'PTS R', 'points_received'),
	diff('points_diff', 'Diff', 'points_diff'),
	num('attendance', 'ATT', 'attendance'),
];
