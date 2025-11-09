export function calculateAge(dateOfBirth: string | Date): number {
	const dob = new Date(dateOfBirth); // handles ISO string or Date
	const today = new Date();

	let age = today.getFullYear() - dob.getFullYear();
	const monthDiff = today.getMonth() - dob.getMonth();
	const dayDiff = today.getDate() - dob.getDate();

	// If birthday hasn't happened yet this year, subtract 1
	if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
		age--;
	}

	return age;
}
