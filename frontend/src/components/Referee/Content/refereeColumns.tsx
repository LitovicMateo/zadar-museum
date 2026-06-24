import type { FC } from 'react';
import { Link } from 'react-router-dom';

import type { StatsColumn } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import { RefereeStats } from '@/types/api/Referee';

export const RefereeLeagueCell: FC<{ leagueSlug?: string | null }> = ({ leagueSlug }) => {
	const { data: league } = useLeagueDetails(leagueSlug || '');
	if (!leagueSlug) return <p>Total</p>;
	return <Link to={APP_ROUTES.league(leagueSlug)}>{league?.name || ''}</Link>;
};

const show = (v: unknown) => (v === null || v === undefined ? '-' : String(v));

const num = (id: string, header: string, key: keyof RefereeStats): StatsColumn<RefereeStats> => ({
	id,
	header,
	cell: (row) => show(row[key]),
	sortValue: (row) => {
		const v = row[key];
		return v === null || v === undefined ? null : Number(v);
	},
	sortDescFirst: true,
});

/** Columns for the referee league / season stats tables. */
export const refereeStatsColumns: StatsColumn<RefereeStats>[] = [
	{
		id: 'league',
		header: 'League',
		cell: (row) => <RefereeLeagueCell leagueSlug={row.league_slug} />,
		meta: { sticky: 'left', stickyOffset: '0' },
	},
	num('games', 'GP', 'games'),
	num('wins', 'W', 'wins'),
	num('losses', 'L', 'losses'),
	num('win_percentage', 'W%', 'win_percentage'),
	num('fouls_for', 'FLS', 'fouls_for'),
	num('fouls_against', 'FLA', 'fouls_against'),
	num('foul_difference', 'Diff', 'foul_difference'),
];
