import { StrapiImage } from './Strapi';

export type StaffMemberFormData = {
	first_name: string;
	last_name: string;
	role: string;
	image?: File | StrapiImage | null;
};

export interface StaffMemberDetailsResponse {
	id: number;
	first_name: string;
	last_name: string;
	role: string;
	image?: StrapiImage | null;
	createdAt: string;
	documentId: string;
}
