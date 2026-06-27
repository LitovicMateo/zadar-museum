import { Link } from 'react-router-dom';

import type { StatsColumn } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { VenueLeagueStats } from '@/types/api/Venue';

/** Heading node for a venue competition group (name link). */
export const venueLeagueHeading = (row: VenueLeagueStats) => {
	if (!row.league_slug) return <span className="font-semibold">{row.league_name ?? 'Total'}</span>;
	return (
		<Link to={APP_ROUTES.league(row.league_slug)} className="font-semibold">
			{row.league_name}
		</Link>
	);
};

const fixed = (v: unknown) => (v === null || v === undefined ? '0.0' : Number(v).toFixed(1));
const intVal = (v: unknown): number => Number(v) || 0;

const numSort = (row: VenueLeagueStats, key: keyof VenueLeagueStats) => {
	const v = row[key];
	return v === null || v === undefined ? null : Number(v);
};

/** Columns for the venue league / season stats tables. */
export const venueStatsColumns: StatsColumn<VenueLeagueStats>[] = [
	{
		id: 'league',
		header: 'League',
		cell: (row) => venueLeagueHeading(row),
		meta: { sticky: 'left', stickyOffset: '0' },
	},
	{
		id: 'games',
		header: 'G',
		cell: (row) => intVal(row.games),
		sortValue: (row) => numSort(row, 'games'),
		sortDescFirst: true,
	},
	{
		id: 'wins',
		header: 'W',
		cell: (row) => intVal(row.wins),
		sortValue: (row) => numSort(row, 'wins'),
		sortDescFirst: true,
	},
	{
		id: 'losses',
		header: 'L',
		cell: (row) => intVal(row.losses),
		sortValue: (row) => numSort(row, 'losses'),
		sortDescFirst: true,
	},
	{
		id: 'win_percentage',
		header: 'Win %',
		cell: (row) => fixed(row.win_percentage),
		sortValue: (row) => numSort(row, 'win_percentage'),
		sortDescFirst: true,
	},
	{
		id: 'avg_attendance',
		header: 'ATT',
		cell: (row) => fixed(row.avg_attendance),
		sortValue: (row) => numSort(row, 'avg_attendance'),
		sortDescFirst: true,
	},
];
