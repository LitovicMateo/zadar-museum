import { StrapiImage } from './Strapi';

export type StaffFormData = {
	first_name: string;
	last_name: string;
	role: string;
};

export interface StaffDetailsResponse {
	id: number;
	first_name: string;
	last_name: string;
	image?: StrapiImage | null;
	role: string;
	createdAt: string;
	documentId: string;
}
