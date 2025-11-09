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
