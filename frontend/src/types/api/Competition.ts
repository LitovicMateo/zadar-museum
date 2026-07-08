import { StrapiImage } from './Strapi';

export type CompetitionFormData = {
	name: string;
	short_name: string;
	alternate_names: { name: string; short_name: string }[];
	trophies: string[];
	image?: File | StrapiImage | null;
};

export type CompetitionDetailsResponse = {
	id: number;
	name: string;
	short_name: string;
	slug: string;
	alternate_names: { name: string; short_name: string }[];
	trophies: string[];
	image?: StrapiImage | null;
	documentId: string;
	createdAt: string;
};

export type CompetitionSeasons = string[];

// Postgres returns aggregate numerics as strings; coerce with Number() at use.
type Num = string | number | null;

export interface SeasonPlayerLeader {
	player_id: string;
	first_name: string;
	last_name: string;
	image_url: string | null;
	games: Num;
	minutes_total: Num;
	minutes_avg: Num;
	points_total: Num;
	points_avg: Num;
	rebounds_total: Num;
	rebounds_avg: Num;
	assists_total: Num;
	assists_avg: Num;
	three_pointers_made_total: Num;
	three_pointers_made_avg: Num;
}

export interface SeasonTeamRecordItem {
	game_id: string;
	opponent_name: string;
	opponent_slug: string;
	season: string;
	stat_value: number;
}

export interface SeasonTeamRecords {
	most_points: SeasonTeamRecordItem[];
	least_points_allowed: SeasonTeamRecordItem[];
	most_threes: SeasonTeamRecordItem[];
	largest_win: SeasonTeamRecordItem[];
	highest_attendance: SeasonTeamRecordItem[];
}

export interface CompetitionDirectoryEntry {
	id: number;
	name: string;
	short_name: string;
	slug: string;
	alternate_names: { name: string; short_name: string }[];
	trophies: string[];
	logo?: StrapiImage;
	documentId: string;
	games: string | null;
	wins: string | null;
	losses: string | null;
	win_percentage: string | null;
}
