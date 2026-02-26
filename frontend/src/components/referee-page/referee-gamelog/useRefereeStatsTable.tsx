import React from 'react';
import { Link } from 'react-router-dom';

import '@/components/ui/table/types';
import { APP_ROUTES } from '@/constants/routes';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';
import { RefereeStats } from '@/types/api/referee';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useRefereeStatsTable = (data: RefereeStats[] | undefined) => {
	const table = useReactTable<RefereeStats>({
		data: data || [],
		columns: [
			{
				header: 'League',
				accessorKey: 'league_slug',
				meta: { sticky: 'left', stickyOffset: '0' },
				cell: (info) => <LeagueCell leagueSlug={info.getValue()} />
			},
			{
				header: 'G',
				accessorKey: 'games'
			},
			{
				header: 'W',
				accessorKey: 'wins'
			},
			{
				header: 'L',
				accessorKey: 'losses'
			},
			{
				header: 'Win %',
				accessorKey: 'win_percentage',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			},
			{
				header: 'For',
				accessorKey: 'fouls_for',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			},
			{
				header: 'Ag.',
				accessorKey: 'fouls_against',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			},
			{
				header: '+/-',
				accessorKey: 'foul_difference',
				cell: (info) => {
					const raw = info.getValue();
					const num = raw === null || raw === undefined ? null : Number(raw);
					return num === null || Number.isNaN(num) ? '-' : `${num.toFixed(1)}`;
				}
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	const LeagueCell: React.FC<{ leagueSlug?: string }> = ({ leagueSlug }) => {
		const { data: league } = useLeagueDetails(leagueSlug || '');
		if (!leagueSlug) return <p>Total</p>;
		const leagueName = league?.name || '';
		return <Link to={APP_ROUTES.league(leagueSlug)}>{leagueName}</Link>;
	};

	return { table };
};
