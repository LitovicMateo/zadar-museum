import { format } from 'date-fns';
import type { CoachDetailsResponse } from '@/types/api/coach';

export function calculateAge(dateOfBirth: string | Date, referenceDate?: string | Date): number {
    const dob = new Date(dateOfBirth);
    const ref = referenceDate ? new Date(referenceDate) : new Date();

    let age = ref.getFullYear() - dob.getFullYear();
    const monthDiff = ref.getMonth() - dob.getMonth();
    const dayDiff = ref.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age;
}

export function formatDate(date?: string | Date | null): string | null {
    if (!date) return null;
    try {
        return format(new Date(date), 'd MMM yyyy');
    } catch (e) {
        return null;
    }
}

export function getCoachBioInfo(coach: CoachDetailsResponse) {
    const birthDateStr = formatDate(coach.date_of_birth);
    const deathDateStr = formatDate(coach.date_of_death);

    const age = coach.date_of_birth ? calculateAge(coach.date_of_birth) : null;
    const ageAtDeath = coach.date_of_birth && coach.date_of_death ? calculateAge(coach.date_of_birth, coach.date_of_death) : null;

    return { birthDateStr, deathDateStr, age, ageAtDeath };
}
