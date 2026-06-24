import type { FC } from 'react';
import { Link } from 'react-router-dom';

import type { StatsColumn } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { useLeagueDetails } from '@/hooks/queries/league/UseLeagueDetails';
import { GameStatsEntry } from '@/types/api/Player';

/** Renders a league name as a link (used for the first, sticky column). */
export const LeagueCell: FC<{ leagueSlug?: string }> = ({ leagueSlug }) => {
	const { data: league } = useLeagueDetails(leagueSlug || '');
	if (!leagueSlug) return <p>Total</p>;
	const leagueName = league?.name || '';
	return (
		<Link to={APP_ROUTES.league(leagueSlug)} className="font-semibold">
			{leagueName}
		</Link>
	);
};

type Key = keyof GameStatsEntry;

const formatNumber = (val: unknown): string => {
	if (val === null || val === undefined || val === '') return '-';
	const n = Number(val);
	return Number.isNaN(n) ? '-' : String(val);
};

const num = (id: string, header: string, key: Key): StatsColumn<GameStatsEntry> => ({
	id,
	header,
	cell: (row) => formatNumber(row[key]),
	sortValue: (row) => {
		const v = row[key];
		return v === null || v === undefined ? null : Number(v);
	},
	sortDescFirst: true,
});

/**
 * Columns for the player league / season stats tables — the StatsTable
 * equivalent of the legacy usePlayerLeagueStatsTable column defs.
 */
export const playerLeagueStatsColumns: StatsColumn<GameStatsEntry>[] = [
	{
		id: 'league',
		header: 'League',
		cell: (row) => <LeagueCell leagueSlug={row.league_slug} />,
		meta: { sticky: 'left', stickyOffset: '0' },
	},
	num('games', 'GP', 'games'),
	num('games_started', 'GS', 'games_started'),
	{
		id: 'minutes',
		header: 'MIN',
		cell: (row) => {
			const val = row.minutes;
			if (val === null || val === undefined) return '-';
			const n = Number(val);
			return Number.isNaN(n) ? '-' : n.toFixed(1);
		},
		sortValue: (row) => (row.minutes === null || row.minutes === undefined ? null : Number(row.minutes)),
		sortDescFirst: true,
	},
	num('points', 'PTS', 'points'),
	num('off_rebounds', 'OR', 'off_rebounds'),
	num('def_rebounds', 'DR', 'def_rebounds'),
	num('rebounds', 'REB', 'rebounds'),
	num('assists', 'AST', 'assists'),
	num('steals', 'STL', 'steals'),
	num('blocks', 'BLK', 'blocks'),
	num('field_goals_made', 'FGM', 'field_goals_made'),
	num('field_goals_attempted', 'FGA', 'field_goals_attempted'),
	num('field_goal_percentage', 'FG%', 'field_goal_percentage'),
	num('three_pointers_made', '3PM', 'three_pointers_made'),
	num('three_pointers_attempted', '3PA', 'three_pointers_attempted'),
	num('three_point_percentage', '3P%', 'three_point_percentage'),
	num('free_throws_made', 'FTM', 'free_throws_made'),
	num('free_throws_attempted', 'FTA', 'free_throws_attempted'),
	num('free_throw_percentage', 'FT%', 'free_throw_percentage'),
	num('efficiency', 'EFF', 'efficiency'),
];
