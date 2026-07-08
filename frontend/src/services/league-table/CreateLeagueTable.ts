import { API_ROUTES } from '@/constants/Routes';
import apiClient from '@/lib/ApiClient';
import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';

const buildStandings = (standings: LeagueTableFormData['standings']) =>
	standings.map((row) => ({
		team: +row.team,
		teamName: row.teamName || null,
		teamShortName: row.teamShortName || null,
		gamesPlayed: +row.gamesPlayed || 0,
		wins: +row.wins || 0,
		// Draws are optional (blank -> null, distinct from an explicit 0).
		draws: row.draws !== '' ? +row.draws : null,
		losses: +row.losses || 0,
		pointsDiff: +row.pointsDiff || 0,
		points: +row.points || 0
	}));

export const buildLeagueTablePayload = (data: LeagueTableFormData) => ({
	season: data.season,
	stageNumber: +data.stageNumber,
	stageName: data.stageName || undefined,
	competition: data.competition,
	standings: buildStandings(data.standings)
});

export const createLeagueTable = async (data: LeagueTableFormData) => {
	const duplicateRes = await apiClient.get(
		API_ROUTES.create.leagueTableCheckDuplicate(data.competition, data.season, data.stageNumber)
	);

	if (duplicateRes.data.isDuplicate) {
		throw new Error('A league table for this competition, season and stage already exists.');
	}

	const res = await apiClient.post(API_ROUTES.create.leagueTable(), {
		data: buildLeagueTablePayload(data)
	});
	return res;
};
