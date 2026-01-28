import { API_ROUTES } from '@/constants/routes';
import apiClient from '@/lib/api-client';
import { GameFormData } from '@/schemas/game-schema';
import { PlayerStatsResponse } from '@/types/api/player-stats';
import { TeamStatsResponse } from '@/types/api/team-stats';
import { uploadGallery } from '@/utils/uploadGallery';

export const updateGame = async ({ id, ...data }: { id: string } & GameFormData) => {
	// fetch existing game to compare which fields actually changed
	let existing: any;
	try {
		const existingRes = await apiClient.get(API_ROUTES.game.details(id));
		existing = existingRes.data as any;
	} catch (err: any) {
		const msg = `Failed to fetch existing game ${id}: ${err?.message || err}`;
		throw new Error(msg);
	}

	const needsStatsRebuild = (() => {
		// fields that, when changed, require deleting/ rebuilding player & team stats
		// intentionally exclude `gallery` so changing images won't trigger deletions
		const watched = [
			'home_team',
			'away_team',
			'date',
			'stage',
			'competition',
			'isNulled',
			'forfeited',
			'venue',
			'home_team_name',
			'away_team_name',
			'home_team_short_name',
			'away_team_short_name'
		];

		for (const f of watched) {
			switch (f) {
				case 'home_team':
					if (+data.home_team !== existing.home_team?.id) return true;
					break;
				case 'away_team':
					if (+data.away_team !== existing.away_team?.id) return true;
					break;
				case 'competition':
					if ((data.competition ? +data.competition : undefined) !== existing.competition?.id) return true;
					break;
				case 'venue':
					if (+data.venue !== existing.venue?.id) return true;
					break;
				case 'date':
					if (data.date !== existing.date) return true;
					break;
				case 'stage':
					if (data.stage !== existing.stage) return true;
					break;
				case 'isNulled':
					if (data.isNulled !== existing.isNulled) return true;
					break;
				case 'forfeited':
					if (data.forfeited !== existing.forfeited) return true;
					break;
				case 'home_team_name':
					if (data.home_team_name !== existing.home_team_name) return true;
					break;
				case 'away_team_name':
					if (data.away_team_name !== existing.away_team_name) return true;
					break;
				case 'home_team_short_name':
					if (
						(data.home_team_short_name || '') !==
						(existing.home_team_short_name || existing.home_team?.short_name || '')
					)
						return true;
					break;
				case 'away_team_short_name':
					if (
						(data.away_team_short_name || '') !==
						(existing.away_team_short_name || existing.away_team?.short_name || '')
					)
						return true;
					break;
				default:
					break;
			}
		}

		return false;
	})();

	const galleryIds = await uploadGallery(data.gallery);

	await apiClient.put(API_ROUTES.edit.game(id), {
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

	if (!needsStatsRebuild) return;

	const teamParams = new URLSearchParams();
	teamParams.append('filters[game][documentId][$eq]', id);
	const playerParams = new URLSearchParams();
	playerParams.append('filters[game][documentId][$eq]', id);

	const teamStatsRes = await apiClient.get(API_ROUTES.create.teamStats(teamParams.toString()));
	const playerStatsRes = await apiClient.get(API_ROUTES.create.playerStats(playerParams.toString()));

	const teamStatsArr = teamStatsRes.data.data;
	const playerStatsArr = playerStatsRes.data.data;

	const deletePromises = teamStatsArr.map((teamStat: TeamStatsResponse) =>
		apiClient.delete(API_ROUTES.edit.teamStats(teamStat.documentId))
	);

	const deletePlayerStatsPromises = playerStatsArr.map((playerStat: PlayerStatsResponse) =>
		apiClient.delete(API_ROUTES.edit.playerStats(playerStat.documentId))
	);

	await Promise.all(deletePromises);
	await Promise.all(deletePlayerStatsPromises);
};
