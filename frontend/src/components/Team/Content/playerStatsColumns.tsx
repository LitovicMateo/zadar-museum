import type { StatsColumn } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { TeamPlayerAggStat } from '@/types/api/Team';
import { Link } from 'react-router-dom';

const show = (v: unknown) => (v === null || v === undefined ? '-' : String(v));

const num = (id: string, header: string, key: keyof TeamPlayerAggStat): StatsColumn<TeamPlayerAggStat> => ({
	id,
	header,
	cell: (row) => show(row[key]),
	sortValue: (row) => {
		const v = row[key];
		return v === null || v === undefined ? null : Number(v);
	},
	sortDescFirst: true
});

/**
 * Roster columns for the League/Season tab player section (Total / Average
 * modes). The backend returns the same field names for both modes — the values
 * are summed or per-game-averaged server-side — so one column set covers both.
 */
export const playerStatsColumns: StatsColumn<TeamPlayerAggStat>[] = [
	{
		id: 'player',
		header: 'Player',
		cell: (row) => (
			<Link to={APP_ROUTES.player(row.player_id)}>
				{row.first_name} {row.last_name}
			</Link>
		),
		sortValue: (row) => `${row.last_name} ${row.first_name}`.toLowerCase(),
		meta: { sticky: 'left', stickyOffset: '0' }
	},
	num('games', 'GP', 'games'),
	num('minutes', 'MIN', 'minutes'),
	num('points', 'PTS', 'points'),
	num('rebounds', 'REB', 'rebounds'),
	num('assists', 'AST', 'assists'),
	num('steals', 'STL', 'steals'),
	num('blocks', 'BLK', 'blocks'),
	num('field_goal_percentage', 'FG%', 'field_goal_percentage'),
	num('three_point_percentage', '3P%', 'three_point_percentage'),
	num('free_throw_percentage', 'FT%', 'free_throw_percentage'),
	num('efficiency', 'EFF', 'efficiency')
];
