import { Link } from 'react-router-dom';

import '@/components/UI/table/Types';
import { APP_ROUTES } from '@/constants/Routes';
import { VenueLeagueStats } from '@/types/api/Venue';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useVenueLeagueStatsTable = (data: VenueLeagueStats[] | undefined) => {
	const table = useReactTable<VenueLeagueStats>({
		data: data || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_name',
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => {
					if (info.getValue() === undefined) return <p>Total</p>;
					const orig = info.row.original as Partial<VenueLeagueStats> | undefined;
					const slug = orig?.league_slug;
					if (!slug) return <span className="font-semibold">{info.getValue()}</span>;
					return (
						<Link to={APP_ROUTES.league(slug)} className="font-semibold">
							{info.getValue()}
						</Link>
					);
				}
			},
			{
				header: 'G',
				accessorKey: 'games',
				cell: (info) => info.getValue() || 0
			},
			{
				header: 'W',
				accessorKey: 'wins',
				cell: (info) => info.getValue() || 0
			},
			{
				header: 'L',
				accessorKey: 'losses',
				cell: (info) => info.getValue() || 0
			},
			{
				header: 'Win %',
				accessorKey: 'win_percentage',
				cell: (info) => Number(info.getValue()).toFixed(1)
			},
			{
				header: 'ATT',
				accessorKey: 'avg_attendance',
				cell: (info) => Number(info.getValue()).toFixed(1)
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	return { table };
};
