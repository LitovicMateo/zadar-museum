export type VenueFormData = {
	name: string;
	city: string;
	country: string;
};

export interface VenueDetailsResponse {
	id: number;
	name: string;
	slug: string;
	city: string;
	country: string;
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
