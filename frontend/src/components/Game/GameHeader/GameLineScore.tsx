import React from 'react';
import { useParams } from 'react-router-dom';

import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { useGameTeamStats } from '@/hooks/queries/game/UseGameTeamStats';

const GameLineScore: React.FC = () => {
	const { gameId } = useParams();

	const { data } = useGameTeamStats(gameId!);
	const { data: game } = useGameDetails(gameId!);

	const ordered = React.useMemo(() => {
		if (!data) return [];
		if (!game) return data;

		const home = data.find(
			(d) => d.team_document_id === game.home_team.documentId || d.team_slug === game.home_team.slug
		);
		const away = data.find(
			(d) => d.team_document_id === game.away_team.documentId || d.team_slug === game.away_team.slug
		);

		const others = data.filter((d) => d !== home && d !== away);

		const result = [] as typeof data;
		if (home) result.push(home);
		if (away) result.push(away);
		result.push(...others);

		return result;
	}, [data, game]);

	if (ordered.length === 0) return null;

	// The game declares its own format — never infer it from which columns are null.
	const isHalves = (game?.period_format ?? ordered[0].period_format) === 'halves';
	const hasOvertime = ordered.some((row) => row.overtime != null);

	const periods: { key: keyof (typeof ordered)[number]; label: string }[] = isHalves
		? [
				{ key: 'first_half', label: '1H' },
				{ key: 'second_half', label: '2H' }
			]
		: [
				{ key: 'first_quarter', label: '1Q' },
				{ key: 'second_quarter', label: '2Q' },
				{ key: 'third_quarter', label: '3Q' },
				{ key: 'fourth_quarter', label: '4Q' }
			];

	if (hasOvertime) periods.push({ key: 'overtime', label: 'OT' });

	// Bail out when there is no usable period data at all.
	const hasData = ordered.some((row) => periods.some((p) => row[p.key] != null));
	if (!hasData) return null;

	return (
		<div className="mx-auto w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-white/5">
			<table className="w-full border-collapse text-center font-mono text-court-foreground tabular-nums">
				<thead>
					<tr className="text-[10px] uppercase tracking-[0.12em] text-court-foreground/50">
						<th className="px-2 py-1.5 text-left font-medium">Team</th>
						{periods.map((p) => (
							<th key={p.label} className="px-2 py-1.5 font-medium">
								{p.label}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{ordered.map((row) => (
						<tr key={row.team_document_id} className="border-t border-white/10 text-sm">
							<td className="px-2 py-1.5 text-left font-semibold text-court-foreground/90">
								{row.team_short_name}
							</td>
							{periods.map((p) => (
								<td key={p.label} className="px-2 py-1.5 text-court-foreground/80">
									{row[p.key] ?? '–'}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default GameLineScore;
