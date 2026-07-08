import React from 'react';

import NoContent from '@/components/NoContent/NoContent';
import TeamLogo from '@/components/Schedule/TeamLogo';
import { APP_ROUTES } from '@/constants/Routes';
import { useTeamLogos } from '@/hooks/queries/team/UseTeamLogos';
import { useLeagueSeasonTeamRecords } from '@/hooks/queries/league/UseLeagueSeasonTeamRecords';

import LeaderCard, { LeaderRow } from './LeaderCard';
import { RECORD_CATEGORIES } from './Options';

type SeasonTeamRecordsProps = {
	leagueSlug: string;
	season: string;
};

const SeasonTeamRecords: React.FC<SeasonTeamRecordsProps> = ({ leagueSlug, season }) => {
	const { data: records } = useLeagueSeasonTeamRecords(leagueSlug, season);
	const logos = useTeamLogos();

	const total = records
		? RECORD_CATEGORIES.reduce((sum, cat) => sum + (records[cat.key]?.length ?? 0), 0)
		: 0;

	return (
		<section className="space-y-4">
			<h2 className="font-display text-lg font-semibold text-court">Team Records</h2>

			{total === 0 ? (
				<NoContent type="info" description="No records found" />
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{RECORD_CATEGORIES.map((cat) => {
						const rows: LeaderRow[] = (records?.[cat.key] ?? []).map((item) => ({
							key: item.game_id,
							to: APP_ROUTES.game(item.game_id),
							name: item.opponent_name,
							value: item.stat_value,
							leading: (
								<TeamLogo
									image={logos.get(item.opponent_slug)}
									name={item.opponent_name}
									className="h-full w-full"
								/>
							)
						}));
						return <LeaderCard key={cat.key} title={cat.label} rows={rows} />;
					})}
				</div>
			)}
		</section>
	);
};

export default SeasonTeamRecords;
