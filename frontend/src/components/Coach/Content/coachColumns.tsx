import type { FC } from 'react';
import { Link } from 'react-router-dom';

import type { StatsColumn } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import { CoachStats } from '@/types/api/Coach';

export const CoachLeagueCell: FC<{ leagueSlug?: string | null }> = ({ leagueSlug }) => {
	const { data: league } = useLeagueDetails(leagueSlug || '');
	if (!leagueSlug) return <p>Total</p>;
	return <Link to={APP_ROUTES.league(leagueSlug)}>{league?.name || ''}</Link>;
};

const show = (v: unknown) => (v === null || v === undefined ? '-' : String(v));

const num = (id: string, header: string, key: keyof CoachStats): StatsColumn<CoachStats> => ({
	id,
	header,
	cell: (row) => show(row[key]),
	sortValue: (row) => {
		const v = row[key];
		return v === null || v === undefined ? null : Number(v);
	},
	sortDescFirst: true,
});

/** Columns for the coach league / season stats tables. */
export const coachStatsColumns: StatsColumn<CoachStats>[] = [
	{
		id: 'league',
		header: 'League',
		cell: (row) => <CoachLeagueCell leagueSlug={row.league_slug} />,
		meta: { sticky: 'left', stickyOffset: '0' },
	},
	num('games', 'G', 'games'),
	num('wins', 'W', 'wins'),
	num('losses', 'L', 'losses'),
	num('win_percentage', 'Win %', 'win_percentage'),
	num('points_scored', 'PTS A', 'points_scored'),
	num('points_received', 'PTS R', 'points_received'),
	num('points_difference', 'PTS D', 'points_difference'),
];
