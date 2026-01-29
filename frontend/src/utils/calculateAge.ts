export function calculateAge(dateOfBirth: string | Date, referenceDate?: string | Date): number {
	const dob = new Date(dateOfBirth); // handles ISO string or Date
	const ref = referenceDate ? new Date(referenceDate) : new Date();

	let age = ref.getFullYear() - dob.getFullYear();
	const monthDiff = ref.getMonth() - dob.getMonth();
	const dayDiff = ref.getDate() - dob.getDate();

	// If birthday hasn't happened yet this year (relative to reference), subtract 1
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age;
}
