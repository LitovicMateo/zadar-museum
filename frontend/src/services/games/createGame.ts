import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { GameFormData } from '@/schemas/game-schema';
import { uploadGallery } from '@/utils/uploadGallery';

export const createGame = async (data: GameFormData) => {
	if (data.stage === 'league' && data.competition) {
		const { season, competition, round, home_team, away_team } = data;

		// Query Strapi for any game in this season+competition+round with either team
		const res = await apiClient.get(API_ROUTES.create.game(), {
			params: {
				filters: {
					season: { $eq: season },
					competition: { $eq: competition },
					round: { $eq: round },
					$or: [
						{ home_team: { $eq: home_team } },
						{ away_team: { $eq: home_team } },
						{ home_team: { $eq: away_team } },
						{ away_team: { $eq: away_team } }
					]
				}
			}
		});

		if (res.data.data.length > 0) {
			throw new Error(
				`Duplicate game detected: One of the teams already has a game in round ${round} of competition ${competition}, season ${season}.`
			);
		}
	}

	const galleryIds = await uploadGallery(data.gallery);

	return apiClient.post(API_ROUTES.create.game(), {
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
};
