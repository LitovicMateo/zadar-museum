import React from 'react';

import LeaderCard, { LeaderRow } from '@/components/League/Content/LeagueSeasonStats/LeaderCard';
import NoContent from '@/components/NoContent/NoContent';
import TeamLogo from '@/components/Schedule/TeamLogo';
import { APP_ROUTES } from '@/constants/Routes';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerSeasonRecords } from '@/hooks/queries/player/UsePlayerSeasonRecords';
import { useTeamLogos } from '@/hooks/queries/team/UseTeamLogos';

import { playerRecordOptions } from '../recordOptions';

/** Per-season single-game record leaders for a player (opponent-facing). */
const PlayerSeasonRecords: React.FC = () => {
	const { playerId, season, selectedDatabase } = useBoxscore();
	const logos = useTeamLogos();

	const { data: records } = usePlayerSeasonRecords(playerId, season, selectedDatabase);

	const total = records
		? playerRecordOptions.reduce((sum, cat) => sum + (records[cat.value]?.length ?? 0), 0)
		: 0;

	if (!season) return null;

	return (
		<section className="space-y-4">
			<h2 className="font-display text-lg font-semibold text-court">Single-Game Records</h2>

			{total === 0 ? (
				<NoContent type="info" description="No records found" />
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{playerRecordOptions.map((cat) => {
						const rows: LeaderRow[] = (records?.[cat.value] ?? []).map((item) => ({
							key: `${item.game_id}-${cat.value}`,
							to: APP_ROUTES.game(item.game_id),
							name: item.opponent_team_name,
							value: Number(item.stat_value),
							leading: (
								<TeamLogo
									image={logos.get(item.opponent_team_slug)}
									name={item.opponent_team_name}
									className="h-full w-full"
								/>
							)
						}));
						return <LeaderCard key={cat.value} title={cat.label} rows={rows} />;
					})}
				</div>
			)}
		</section>
	);
};

export default PlayerSeasonRecords;
