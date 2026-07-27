import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil } from 'lucide-react';

import NoContent from '@/components/NoContent/NoContent';
import TeamLogo from '@/components/Schedule/TeamLogo';
import { StatsTable, type StatsColumn, type StatsGroup } from '@/components/UI/stats-table';
import { APP_ROUTES } from '@/constants/Routes';
import { useAuth } from '@/context/AuthContext';
import { useLeagueTablesByLeague } from '@/hooks/queries/league-table/UseLeagueTablesByLeague';
import { useTeamLogos } from '@/hooks/queries/team/UseTeamLogos';
import { LeagueTableStanding } from '@/types/api/LeagueTable';

type LeagueFinalStandingsProps = {
	leagueSlug: string;
	season: string;
};

const fmtDiff = (v: number) => (v > 0 ? `+${v}` : `${v}`);

const LeagueFinalStandings: React.FC<LeagueFinalStandingsProps> = ({ leagueSlug, season }) => {
	const { data: tables } = useLeagueTablesByLeague(leagueSlug, season);
	const { isAuthenticated } = useAuth();
	const logos = useTeamLogos();

	// Columns are built per table so the optional Draws (D) column can be shown only
	// for stages where at least one team recorded a draw.
	const makeColumns = (showDraws: boolean): StatsColumn<LeagueTableStanding>[] => [
		{
			id: 'position',
			header: '#',
			cell: (r) => r.position,
			meta: { sticky: 'left', stickyOffset: '0' }
		},
		{
			id: 'team',
			header: 'Team',
			cell: (r) => (
				<span className="flex items-center gap-2">
					<TeamLogo
						image={r.teamSlug ? logos.get(r.teamSlug) : undefined}
						name={r.teamName}
						className="h-5 w-5"
					/>
					<span className="font-medium">
						<span className="hidden sm:inline">{r.teamName ?? '-'}</span>
						<span className="sm:hidden">{r.teamShortName ?? r.teamName ?? '-'}</span>
					</span>
				</span>
			),
			meta: { align: 'left' }
		},
		{ id: 'gamesPlayed', header: 'GP', cell: (r) => r.gamesPlayed, sortValue: (r) => r.gamesPlayed },
		{ id: 'wins', header: 'W', cell: (r) => r.wins, sortValue: (r) => r.wins },
		...(showDraws
			? [
					{
						id: 'draws',
						header: 'D',
						cell: (r: LeagueTableStanding) => r.draws ?? '–',
						sortValue: (r: LeagueTableStanding) => r.draws ?? 0
					}
				]
			: []),
		{ id: 'losses', header: 'L', cell: (r) => r.losses, sortValue: (r) => r.losses },
		{
			id: 'pointsDiff',
			header: '+/-',
			cell: (r) => fmtDiff(r.pointsDiff),
			sortValue: (r) => r.pointsDiff
		},
		{ id: 'points', header: 'PTS', cell: (r) => r.points, sortValue: (r) => r.points }
	];

	if (!tables || tables.length === 0) return null;

	return (
		<section className="space-y-6">
			<h2 className="font-display text-lg font-semibold text-court">Final Standings</h2>

			{tables.map((table) => {
				const showDraws = table.standings.some((row) => row.draws != null);
				const columns = makeColumns(showDraws);
				const groups: StatsGroup<LeagueTableStanding>[] = [
					{
						key: `stage-${table.stageNumber}`,
						rows: table.standings.map((row) => ({ key: String(row.teamId), data: row }))
					}
				];

				return (
					<div key={table.documentId} className="space-y-2">
						<div className="flex items-center justify-between">
							<h3 className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground">
								{table.stageName || `Stage ${table.stageNumber}`}
							</h3>
							{isAuthenticated && (
								<Link
									to={`${APP_ROUTES.dashboard.leagueTable.edit}${table.documentId}`}
									className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-court"
								>
									<Pencil size={12} /> Edit
								</Link>
							)}
						</div>

						{table.standings.length === 0 ? (
							<NoContent type="info" description="No standings entered" />
						) : (
							<StatsTable columns={columns} groups={groups} />
						)}
					</div>
				);
			})}
		</section>
	);
};

export default LeagueFinalStandings;
