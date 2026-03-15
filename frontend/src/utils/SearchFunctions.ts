import slugify from 'react-slugify';

import { CoachDetailsResponse, CoachStatsRanking } from '@/types/api/Coach';
import { CompetitionDetailsResponse } from '@/types/api/Competition';
import { PlayerAllTimeStats, PlayerResponse } from '@/types/api/Player';
import { RefereeDetailsResponse, RefereeStatsRanking } from '@/types/api/Referee';
import { TeamDetailsResponse, TeamScheduleResponse, TeamStatsRanking } from '@/types/api/Team';
import { VenueDetailsResponse } from '@/types/api/Venue';

export const searchPlayers = (players: PlayerResponse[], term: string) => {
	if (!term || !players) return players;

	const filteredPlayers = players?.filter((player) => {
		const name = slugify(`${player.first_name} ${player.last_name}`, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredPlayers;
};

export const searchTeams = (teams: TeamDetailsResponse[], term: string) => {
	if (!term || !teams) return teams;

	const filteredTeams = teams?.filter((team) => {
		const name = slugify(team.name, { delimiter: ' ' });
		const alternateNames = team.alternate_names.map((name) => slugify(name.name, { delimiter: ' ' }));
		const items = [name, ...alternateNames];
		return items.some((item) => item.includes(term));
	});

	return filteredTeams;
};

export const searchCoaches = (coaches: CoachDetailsResponse[], term: string) => {
	if (!term || !coaches) return coaches;

	const filteredCoaches = coaches?.filter((coach) => {
		const name = slugify(`${coach.first_name} ${coach.last_name}`, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredCoaches;
};

export const searchVenues = (venues: VenueDetailsResponse[], term: string) => {
	if (!term || !venues) return venues;

	const filteredVenues = venues?.filter((venue) => {
		const name = slugify(venue.name, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredVenues;
};

export const searchReferees = (referees: RefereeDetailsResponse[], term: string) => {
	if (!term || !referees) return referees;

	const filteredReferees = referees?.filter((referee) => {
		const name = slugify(`${referee.first_name} ${referee.last_name}`, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredReferees;
};

export const searchLeagues = (leagues: CompetitionDetailsResponse[], term: string) => {
	if (!term || !leagues) return leagues;

	const filteredLeagues = leagues?.filter((league) => {
		const name = slugify(league.name, { delimiter: ' ' });
		const alternateNames = league.alternate_names.map((name) => slugify(name.name, { delimiter: ' ' }));
		const items = [name, ...alternateNames];
		return items.some((item) => item.includes(term));
	});

	return filteredLeagues;
};

export const searchGames = (game: TeamScheduleResponse, term: string) => {
	if (!term || !game) return game;

	const item = slugify(`${game.home_team_name} vs ${game.away_team_name}`, { delimiter: ' ' });
	return item.includes(term);
};

export const searchPlayerStats = (stats: PlayerAllTimeStats[] | undefined, term: string) => {
	if (!term || !stats) return stats;

	const filteredPlayers = stats?.filter((stat) => {
		const name = slugify(`${stat.first_name} ${stat.last_name}`, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredPlayers;
};

export const searchRefereeStats = (stats: RefereeStatsRanking[] | undefined, term: string) => {
	if (!term || !stats) return stats;

	const filteredReferees = stats?.filter((stat) => {
		const name = slugify(`${stat.first_name} ${stat.last_name}`, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredReferees;
};

export const searchCoachStats = (stats: CoachStatsRanking[] | undefined, term: string) => {
	if (!term || !stats) return stats;

	const filteredCoaches = stats?.filter((stat) => {
		const name = slugify(`${stat.first_name} ${stat.last_name}`, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredCoaches;
};

export const searchTeamStats = (stats: TeamStatsRanking[] | undefined, term: string) => {
	if (!term || !stats) return stats;

	const filteredTeams = stats?.filter((stat) => {
		const name = slugify(stat.team_name, {
			delimiter: ' '
		});
		return name.includes(term);
	});

	return filteredTeams;
};
