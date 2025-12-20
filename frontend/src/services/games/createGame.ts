import { API_ROUTES } from '@/constants/routes';
import { GameFormData } from '@/schemas/game-schema';
import apiClient, { unwrapCollection, unwrapSingle } from '@/services/apiClient';
import { uploadGallery } from '@/utils/uploadGallery';

export const createGame = async (data: GameFormData) => {
	if (data.stage === 'league' && data.competition) {
		const { season, competition, round, home_team, away_team } = data;

		// Build query string for Strapi filters (avoid complex axios params)
		const params = new URLSearchParams();
		params.append('filters[season][$eq]', String(season));
		params.append('filters[competition][$eq]', String(competition));
		params.append('filters[round][$eq]', String(round));
		params.append('filters[$or][0][home_team][$eq]', String(home_team));
		params.append('filters[$or][1][away_team][$eq]', String(home_team));
		params.append('filters[$or][2][home_team][$eq]', String(away_team));
		params.append('filters[$or][3][away_team][$eq]', String(away_team));

		const res = await apiClient.get(API_ROUTES.create.game(params.toString()));

		if (!res || res.status >= 400) {
			throw new Error('Failed to validate duplicate game');
		}

		const existing = unwrapCollection<{ id: number }>(res as unknown as { data?: unknown });

		if (existing.length > 0) {
			throw new Error(
				`Duplicate game detected: One of the teams already has a game in round ${round} of competition ${competition}, season ${season}.`
			);
		}
	}

	const galleryIds = await uploadGallery(data.gallery);

	const res = await apiClient.post(API_ROUTES.create.game(), {
		data: {
			season: data.season,
			round: data.round,
			home_team: +data.home_team,
			home_team_name: data.home_team_name,
			home_team_short_name: data.home_team_short_name,
			away_team: +data.away_team,
			away_team_name: data.away_team_name,
			away_team_short_name: data.away_team_short_name,
			date: data.date,
			stage: data.stage,
			competition: data.competition ? +data.competition : undefined,
			league_name: data.league_name,
			league_short_name: data.league_short_name,
			venue: +data.venue,
			isNeutral: data.isNeutral,
			isNulled: data.isNulled,
			forfeited: data.forfeited,
			forfeited_by: data.forfeited_by,
			attendance: data.attendance ? data.attendance : undefined,
			mainReferee: data.mainReferee ? +data.mainReferee : undefined,
			secondReferee: data.secondReferee ? +data.secondReferee : undefined,
			thirdReferee: data.thirdReferee ? +data.thirdReferee : undefined,
			staffers: data.staffers && data.staffers.length > 0 ? data.staffers.map((s) => +s) : [],
			gallery: galleryIds.length > 0 ? galleryIds : []
		}
	});

	if (res.status >= 200 && res.status < 300)
		return unwrapSingle<Record<string, unknown>>(res as unknown as { data?: unknown });

	throw new Error(`createGame failed: ${res.status}`);
};
