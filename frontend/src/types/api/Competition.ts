import { StrapiImage } from './Strapi';

export type CompetitionFormData = {
	name: string;
	short_name: string;
	alternate_names: { name: string; short_name: string }[];
	trophies: string[];
};

export type CompetitionDetailsResponse = {
	id: number;
	name: string;
	short_name: string;
	slug: string;
	alternate_names: { name: string; short_name: string }[];
	trophies: string[];
	documentId: string;
	createdAt: string;
};

export type CompetitionSeasons = string[];

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
