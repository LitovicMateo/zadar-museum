import { CompetitionDetailsResponse } from './Competition';
import { RefereeDetailsResponse } from './Referee';
import { StaffDetailsResponse } from './Staff';
import { TeamDetailsResponse } from './Team';
import { VenueDetailsResponse } from './Venue';

export type GalleryMedia = {
	url: string;
	width: number;
	height: number;
	alt: string;
	mime?: string; // e.g. "image/jpeg", "video/mp4"
};

/**
 * Whether a game was played in four quarters or two halves. Croatian basketball
 * used two 20-minute halves until FIBA switched to 4x10 quarters for the 2000-01
 * season, so historical games carry 'halves'.
 */
export type PeriodFormat = 'quarters' | 'halves';

export type GameDetailsResponse = {
	documentId: string;
	id: number;
	season: string;
	round: string;
	group_name?: string;
	stage: 'league' | 'group' | 'playoff' | null;
	period_format: PeriodFormat;
	home_team: TeamDetailsResponse;
	home_team_name: string;
	home_team_short_name: string;
	away_team: TeamDetailsResponse;
	away_team_name: string;
	away_team_short_name: string;
	date: string;
	venue: VenueDetailsResponse;
	isNeutral: boolean;
	isNulled: boolean;
	forfeited: boolean;
	forfeited_by: 'home' | 'away' | 'none';
	competition: CompetitionDetailsResponse;
	league_name: string;
	league_short_name: string;
	createdAt: Date;
	attendance: string;
	gallery?: GalleryMedia[];
	mainReferee: RefereeDetailsResponse;
	secondReferee: RefereeDetailsResponse;
	thirdReferee: RefereeDetailsResponse;
	staffers?: StaffDetailsResponse[];
};
