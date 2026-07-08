import { LeagueTableFormData } from '@/schemas/LeagueTableSchema';
import { LeagueTableRecord } from '@/types/api/LeagueTable';

const toStr = (v: unknown) => (v === null || v === undefined ? '' : String(v));

/**
 * Builds the react-hook-form default values for the league-table form from a
 * loaded record. Shared by LeagueTableFormPage (initial mount) and
 * LeagueTableFormProvider (async reset) so the two never drift.
 */
export const buildLeagueTableDefaults = (record: LeagueTableRecord): LeagueTableFormData => ({
	season: toStr(record.season),
	competition: toStr(record.competition?.id),
	stageNumber: toStr(record.stageNumber),
	stageName: toStr(record.stageName),
	standings: (record.standings ?? []).map((row) => ({
		team: toStr(row.team),
		teamName: toStr(row.teamName),
		teamShortName: toStr(row.teamShortName),
		gamesPlayed: toStr(row.gamesPlayed),
		wins: toStr(row.wins),
		draws: toStr(row.draws),
		losses: toStr(row.losses),
		pointsDiff: toStr(row.pointsDiff),
		points: toStr(row.points)
	}))
});
