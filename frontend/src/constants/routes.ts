import { PlayerDB } from '@/pages/Player/Player';

// API root: prefer the Vite environment variable VITE_API_ROOT (set in production).
// Fallback to the local Strapi dev server used during development.
const root = (import.meta.env.VITE_API_ROOT as string) || 'https://www.ovdjejekosarkasve.com/api';

export const API_ROUTES = {
	// auth
	auth: {
		login: `${root}/auth/local`
	},
	create: {
		player: (params?: string) => `${root}/players?${params}`,
		referee: (params?: string) => `${root}/referees?${params}`,
		team: (params?: string) => `${root}/teams?${params}`,
		coach: (params?: string) => `${root}/coaches?${params}`,
		staff: (params?: string) => `${root}/staff?${params}`,
		game: (params?: string) => `${root}/games?${params}`,
		venue: (params?: string) => `${root}/venues?${params}`,
		competition: (params?: string) => `${root}/competitions?${params}`,
		playerStats: (params?: string) => `${root}/player-stats?${params}`,
		teamStats: (params?: string) => `${root}/team-stats?${params}`
	},

	edit: {
		player: (id: string) => `${root}/players/${id}`,
		referee: (id: string) => `${root}/referees/${id}`,
		team: (id: string) => `${root}/teams/${id}`,
		coach: (id: string) => `${root}/coaches/${id}`,
		staff: (id: string) => `${root}/staff/${id}`,
		game: (id: string) => `${root}/games/${id}`,
		venue: (id: string) => `${root}/venues/${id}`,
		competition: (id: string) => `${root}/competitions/${id}`,
		playerStats: (id: string) => `${root}/player-stats/${id}`,
		teamStats: (id: string) => `${root}/team-stats/${id}`
	},

	// player
	player: {
		stats: {
			boxscore: (params: string) => `${root}/players/boxscore?${params}`,
			allTime: (db: PlayerDB, params: string) => `${root}/players/stats/${db}/all-time?${params}`,
			league: (db: PlayerDB, params: string) => `${root}/players/stats/${db}/all-time/league?${params}`,
			careerHigh: (playerId: string, db: PlayerDB) => `${root}/players/stats/${db}/career-high/${playerId}`,
			seasonAverage: (playerId: string, season: string, db: PlayerDB) =>
				`${root}/players/stats/${db}/${season}/average/total/${playerId}`,
			seasonLeagueAverage: (playerId: string, season: string, db: PlayerDB) =>
				`${root}/players/stats/${db}/${season}/average/league/${playerId}`
		},
		profile: {
			details: (id: string) => `${root}/players/${id}?populate=*`,
			number: (playerId: string) => `${root}/players/player-number/${playerId}`
		},
		seasons: (playerId: string, db: PlayerDB) => `${root}/players/seasons/${playerId}/${db}`,
		competitions: (playerId: string, seasons: string) => `${root}/players/competitions/${seasons}/${playerId}`,
		teams: (playerid: string) => `${root}/players/teams/${playerid}`
	},
	team: {
		details: (slug: string) => `${root}/teams?filters[slug][$eq]=${slug}&populate=*`, //
		stats: {
			total: (slug: string) => `${root}/team/stats/total/${slug}`,
			leagueStats: (teamId: string) => `${root}/team/stats/league/${teamId}`,
			leaders: (params: string) => `${root}/team/leaders?${params}`,
			seasonLeagueStats: (teamId: string, season: string) => `${root}/team/stats/${season}/league/${teamId}`,
			seasonTotalStats: (teamId: string, season: string) => `${root}/team/stats/${season}/total/${teamId}`
		},
		schedule: (season: string, teamSlug: string) => `${root}/team/schedule/${season}/${teamSlug}`,
		seasons: (teamSlug: string) => `${root}/team/seasons/${teamSlug}`,
		competitions: (params: string) => `${root}/team/competitions?${params}`,
		teamCompetitions: (teamSlug: string) => `${root}/team/competitions/${teamSlug}`
	},
	game: {
		details: (id: string) => `${root}/games/${id}`,
		score: (id: string) => `${root}/game/score/${id}`,
		teamStats: (gameId: string) => `${root}/game/team-stats/${gameId}`,
		boxscore: (gameId: string, teamSlug: string) => `${root}/game/boxscore/${gameId}/${teamSlug}`,
		coaches: (gameId: string, teamSlug: string) => `${root}/game/coaches/${gameId}/${teamSlug}`
	},
	coach: {
		details: (id: string) => `${root}/coach/${id}`,
		seasons: (id: string) => `${root}/coach/seasons/${id}`,
		competitions: (coachId: string, seasons: string) => `${root}/coach/competitions/${seasons}/${coachId}`,
		gamelog: (id: string, db: PlayerDB) => `${root}/coach/gamelog/${id}/${db}`,
		record: (id: string, db: PlayerDB) => `${root}/coach/team-record/${id}/${db}`,
		leagueStats: (id: string, db: PlayerDB) => `${root}/coach/league-stats/${id}/${db}`,
		teams: (coachId: string) => `${root}/coach/teams/${coachId}`,
		seasonLeagueStats: (coachId: string, season: string, db: PlayerDB) =>
			`${root}/coach/stats/league/${coachId}/${season}/${db}`,
		seasonTotalStats: (coachId: string, season: string, db: PlayerDB) =>
			`${root}/coach/stats/total/${coachId}/${season}/${db}`
	},
	staff: {
		details: (id: string) => `${root}/staff/${id}?populate=*`,
		gamelog: (id: string) => `${root}/staff/gamelog/${id}`,
		list: (params?: string) => `${root}/staff?${params}`
	},
	league: {
		details: (slug: string) => `${root}/league/${slug}?populate=*`,
		gamelog: (slug: string, season: string) => `${root}/league/games/${slug}/${season}`,
		seasons: (slug: string) => `${root}/league/seasons/${slug}`,
		playerRankings: (slug: string, stat: string) => `${root}/league/player-rankings/${slug}/${stat}`,
		teamRecord: (slug: string) => `${root}/league/team-record/${slug}`,
		playerSeasonStats: (slug: string, season: string) => `${root}/league/player-stats/${slug}/${season}`,
		teamSeasonStats: (slug: string, season: string) => `${root}/league/team-stats/${slug}/${season}`
	},
	referee: {
		details: (id: string) => `${root}/referees/${id}?populate=*`,
		gamelog: (id: string) => `${root}/referee/gamelog/${id}`,
		teamRecord: (id: string) => `${root}/referee/team-record/${id}`,
		seasons: (id: string) => `${root}/referee/seasons/${id}`,
		competitions: (refereeId: string, seasons: string) => `${root}/referee/competitions/${seasons}/${refereeId}`,
		seasonStats: (refereeId: string, season: string) => `${root}/referee/stats/${season}/total/${refereeId}`,
		seasonLeagueStats: (refereeId: string, season: string) => `${root}/referee/stats/${season}/league/${refereeId}`
	},
	venue: {
		details: (slug: string) => `${root}/venue/${slug}`,
		gamelog: (slug: string, season: string) => `${root}/venue/gamelog/${slug}/${season}`,
		teamRecord: (slug: string) => `${root}/venue/team-record/${slug}`,
		seasons: (slug: string) => `${root}/venue/seasons/${slug}`,
		competitions: (venueSlug: string, seasons: string) => `${root}/venue/competitions/${seasons}/${venueSlug}`,
		seasonStats: (venueSlug: string, season: string) => `${root}/venue/stats/${season}/total/${venueSlug}`,
		seasonLeagueStats: (venueSlug: string, season: string) => `${root}/venue/stats/${season}/league/${venueSlug}`
	},
	stats: {
		player: {
			allTime: (params: string) => `${root}/stats/player/all-time?${params}`,
			game: (params: string) => `${root}/stats/player/game?${params}`,
			records: (params: string) => `${root}/stats/player/records?${params}`
		},
		team: {
			allTime: (params: string) => `${root}/stats/team/all-time?${params}`,
			game: (params: string) => `${root}/stats/team/game?${params}`,
			records: (params: string) => `${root}/stats/team/records?${params}`
		},
		coach: {
			allTime: (params: string) => `${root}/stats/coach/all-time?${params}`
		},
		referee: {
			allTime: (params: string) => `${root}/stats/referee/all-time?${params}`
		}
	},
	dashboard: {
		seasons: `${root}/dashboard/seasons`,
		seasonCompetitions: (season: string) => `${root}/dashboard/competitions/${season}`,
		competitionGames: (season: string, competition: string) => `${root}/dashboard/games/${season}/${competition}`,
		teamsInGame: (gameId: string) => `${root}/dashboard/game/teams/${gameId}`,
		players: (params: string) => `${root}/dashboard/players?${params}`,
		coaches: (params: string) => `${root}/dashboard/coaches?${params}`,
		staff: (params: string) => `${root}/dashboard/staff?${params}`,
		referees: (params: string) => `${root}/dashboard/referees?${params}`,
		venues: (params: string) => `${root}/dashboard/venues?${params}`,
		teams: (params: string) => `${root}/dashboard/teams?${params}`,
		competitions: (params: string) => `${root}/dashboard/competitions?${params}`,
		games: (params: string) => `${root}/dashboard/games?${params}`,
		playerStats: (params: string) => `${root}/dashboard/player-stats?${params}`,
		teamStats: (params: string) => `${root}/dashboard/team-stats?${params}`
	}
};

export const APP_ROUTES = {
	home: '/',

	// auth
	login: '/login',

	// dashboard
	dashboard: {
		default: '/dashboard',
		player: {
			create: '/dashboard/player/create',
			edit: (playerId: string) => `/dashboard/player/edit/${playerId}`
		},
		staff: {
			create: '/dashboard/staff/create',
			edit: (staffId: string) => `/dashboard/staff/edit/${staffId}`
		},
		team: {
			create: '/dashboard/team/create',
			edit: (teamId: string) => `/dashboard/team/edit/${teamId}`
		},
		referee: {
			create: '/dashboard/referee/create',
			edit: (refereeId: string) => `/dashboard/referee/edit/${refereeId}`
		},
		coach: {
			create: '/dashboard/coach/create',
			edit: (coachId: string) => `/dashboard/coach/edit/${coachId}`
		},
		game: {
			create: '/dashboard/game/create',
			edit: (gameId: string) => `/dashboard/game/edit/${gameId}`
		},
		venue: {
			create: '/dashboard/venue/create',
			edit: (venueId: string) => `/dashboard/venue/edit/${venueId}`
		},
		competition: {
			create: '/dashboard/competition/create',
			edit: (competitionId: string) => `/dashboard/competition/edit/${competitionId}`
		},
		playerStats: {
			create: '/dashboard/player-stats/create',
			edit: (playerStatsId: string) => `/dashboard/player-stats/edit/${playerStatsId}`
		},
		teamStats: {
			create: '/dashboard/team-stats/create',
			edit: (teamStatsId: string) => `/dashboard/team-stats/edit/${teamStatsId}`
		}
	},

	// stats
	stats: {
		default: '/stats',
		player: '/stats/player',
		team: '/stats/team',
		coach: '/stats/coach',
		referee: '/stats/referee'
	},

	// players
	players: '/players',
	player: (id: string) => `/player/${id}`,

	// coaches
	coaches: '/coaches',
	coach: (id: string) => `/coach/${id}`,

	// referees
	referees: '/referees',
	referee: (refeereId: string) => `/referee/${refeereId}`,

	// teams
	teams: '/teams',
	team: (id: string) => `/team/${id}`,

	// games
	games: '/games',
	game: (id: string) => `/game/${id}`,

	// venues
	venues: '/venues',
	venue: (venueSlug: string) => `/venue/${venueSlug}`,

	// leagues
	leagues: '/leagues',
	league: (leagueSlug: string) => `/league/${leagueSlug}`
};
