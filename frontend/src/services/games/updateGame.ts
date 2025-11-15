import { API_ROUTES } from '@/constants/routes';
import { GameFormData } from '@/schemas/game-schema';
import { PlayerStatsResponse } from '@/types/api/player-stats';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { uploadGallery } from '@/utils/uploadGallery';
import axios from 'axios';

export const updateGame = async ({ id, ...data }: { id: string } & GameFormData) => {
	const galleryIds = await uploadGallery(data.gallery);

	await axios.put(API_ROUTES.edit.game(id), {
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
			attendance: data.attendance ? data.attendance : null,
			mainReferee: data.mainReferee || null,
			secondReferee: data.secondReferee ? +data.secondReferee : null,
			thirdReferee: data.thirdReferee ? +data.thirdReferee : null,
			staffers: data.staffers && data.staffers.length > 0 ? data.staffers.map((s) => +s) : [],
			gallery: galleryIds.length > 0 ? galleryIds : []
		}
	});

	const teamParams = new URLSearchParams();
	teamParams.append('filters[game][documentId][$eq]', id);
	const playerParams = new URLSearchParams();
	playerParams.append('filters[game][documentId][$eq]', id);

	const teamStatsRes = await axios.get(API_ROUTES.create.teamStats(teamParams.toString()));
	const playerStatsRes = await axios.get(API_ROUTES.create.playerStats(playerParams.toString()));

	const teamStatsArr = teamStatsRes.data.data;
	const playerStatsArr = playerStatsRes.data.data;

	const deletePromises = teamStatsArr.map((teamStat: TeamStatsResponse) =>
		axios.delete(API_ROUTES.edit.teamStats(teamStat.documentId))
	);

	const deletePlayerStatsPromises = playerStatsArr.map((playerStat: PlayerStatsResponse) =>
		axios.delete(API_ROUTES.edit.playerStats(playerStat.documentId))
	);

	await Promise.all(deletePromises);
	await Promise.all(deletePlayerStatsPromises);
};
