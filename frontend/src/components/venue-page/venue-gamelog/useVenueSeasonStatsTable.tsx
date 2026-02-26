import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { VenueSeasonStats } from '@/types/api/venue';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useVenueSeasonStatsTable = (seasonStats: VenueSeasonStats[] | undefined) => {
	const table = useReactTable<VenueSeasonStats>({
		data: seasonStats || [],
		columns: [
			{
				header: 'Legaue',
				accessorKey: 'league_name',
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => {
					if (info.getValue() === undefined) return <p>Total</p>;
					const orig = info.row.original as Partial<VenueSeasonStats> | undefined;
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
				cell: (info) => info.getValue().toFixed(1) || 0
			},
			{
				header: 'ATT',
				accessorKey: 'avg_attendance',
				cell: (info) => info.getValue().toFixed(1) || 0
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	return { table };
};
