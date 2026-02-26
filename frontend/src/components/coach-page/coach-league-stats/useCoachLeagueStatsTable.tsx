import '@/components/ui/table/types';
import { CoachLeagueStatsResponse } from '@/types/api/coach';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

export const useCoachLeagueStatsTable = (data: CoachLeagueStatsResponse[] | undefined) => {
	const table = useReactTable<CoachLeagueStatsResponse>({
		data: data ?? [],
		columns: [
			{
				header: '',
				id: 'league',
				columns: [
					{
						header: 'League',
						accessorKey: 'league_name',
						meta: { sticky: 'left', stickyOffset: '0' }
					}
				]
			},
			{
				header: 'Total',
				columns: [
					{
						header: 'GP',
						accessorKey: 'total_games',
						cell: (info) => {
							if (info.getValue() === 0) {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'W',
						accessorKey: 'total_wins',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'L',
						accessorKey: 'total_losses',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: '%',
						accessorKey: 'total_win_pct',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'S',
						accessorKey: 'points_scored',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'A',
						accessorKey: 'points_received',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: '+/-',
						accessorKey: 'pts_diff',
						cell: (info) => {
							if (info.row.original.total_games === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					}
				]
			},
			{
				header: 'Head',
				columns: [
					{
						header: 'GP',
						accessorKey: 'games_head',
						cell: (info) => {
							if (info.getValue() === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'W',
						accessorKey: 'wins_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'L',
						accessorKey: 'losses_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: '%',
						accessorKey: 'win_pct_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'S',
						accessorKey: 'pts_scored_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'A',
						accessorKey: 'pts_received_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: '+/-',
						accessorKey: 'diff_head',
						cell: (info) => {
							if (info.row.original.games_head === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					}
				]
			},
			{
				header: 'Assistant',
				columns: [
					{
						header: 'GP',
						accessorKey: 'games_assistant',
						cell: (info) => {
							if (info.getValue() === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'W',
						accessorKey: 'wins_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: 'L',
						accessorKey: 'losses_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue()}</p>
								</div>
							);
						}
					},
					{
						header: '%',
						accessorKey: 'win_pct_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'S',
						accessorKey: 'pts_scored_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: 'A',
						accessorKey: 'pts_received_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					},
					{
						header: '+/-',
						accessorKey: 'avg_diff_assistant',
						cell: (info) => {
							if (info.row.original.games_assistant === '0') {
								return (
									<div className="min-w-6">
										<p>-</p>
									</div>
								);
							}

							return (
								<div className="min-w-6">
									<p>{info.getValue().toFixed(1)}</p>
								</div>
							);
						}
					}
				]
			}
		],
		getCoreRowModel: getCoreRowModel()
	});

	return { table };
};
