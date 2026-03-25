import { StrapiImage } from './Strapi';

export type VenueFormData = {
	name: string;
	city: string;
	country: string;
	image?: File | StrapiImage | null;
};

export interface VenueDetailsResponse {
	id: number;
	name: string;
	slug: string;
	city: string;
	country: string;
	image?: StrapiImage | null;
	createdAt: string;
	documentId: string;
}

export interface VenueTeamRecordResponse {
	venue_slug: string;
	games: number;
	wins: number;
	losses: number;
	win_percentage: number;
	avg_attendance: number;
}

export interface VenueSeasonStats extends VenueTeamRecordResponse {
	season: string;
	league_name: string;
	league_id: string;
	league_slug: string;
}

export interface VenueLeagueStats extends VenueTeamRecordResponse {
	league_name: string;
	league_id: string;
	league_slug: string;
}

export interface VenuePlayerRecord {
	game_id: string;
	first_name: string;
	last_name: string;
	season: string;
	stat_value: number;
}

export interface VenueTeamRecord {
	game_id: string;
	opponent_name: string;
	opponent_slug: string;
	season: string;
	stat_value: number;
}

export interface VenueDirectoryEntry {
	id: number;
	name: string;
	slug: string;
	nation?: string;
	city?: string;
	image?: StrapiImage;
	games: string;
	wins: string;
	losses: string;
	win_percentage: string;
}
