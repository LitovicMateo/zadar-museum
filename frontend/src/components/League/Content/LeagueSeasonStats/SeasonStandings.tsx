import React from 'react';

import { useLeagueGames } from '@/hooks/queries/league/UseLeagueGames';
import { useLeagueTablesByLeague } from '@/hooks/queries/league-table/UseLeagueTablesByLeague';

import LeagueFinalStandings from './LeagueFinalStandings';
import LeaguePlayoffSchedule from './LeaguePlayoffSchedule';

type SeasonStandingsProps = {
	leagueSlug: string;
	season: string;
};

/**
 * Renders the season's final standings and, when the competition had a playoff, the playoff
 * schedule beside it (stacked below on small screens). Both only appear when a league table
 * exists for the competition + season.
 */
const SeasonStandings: React.FC<SeasonStandingsProps> = ({ leagueSlug, season }) => {
	const { data: tables } = useLeagueTablesByLeague(leagueSlug, season);
	const { data: games } = useLeagueGames(leagueSlug, season);

	// No league table -> render nothing (mirrors LeagueFinalStandings' own gate).
	if (!tables || tables.length === 0) return null;

	const playoffGames = (games ?? []).filter((g) => g.stage === 'playoff');

	if (playoffGames.length === 0) {
		return <LeagueFinalStandings leagueSlug={leagueSlug} season={season} />;
	}

	return (
		<div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
			<LeagueFinalStandings leagueSlug={leagueSlug} season={season} />
			<LeaguePlayoffSchedule games={playoffGames} />
		</div>
	);
};

export default SeasonStandings;
