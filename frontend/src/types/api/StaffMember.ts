export type StaffMemberFormData = {
	first_name: string;
	last_name: string;
	role: string;
};

export interface StaffMemberDetailsResponse {
	id: number;
	first_name: string;
	last_name: string;
	role: string;
	createdAt: string;
	documentId: string;
}
