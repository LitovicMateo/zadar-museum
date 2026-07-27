import { TeamStatsFormData } from '@/schemas/TeamStatsSchema';

/**
 * Blank inputs must reach Strapi as null, not 0. A plain `+value` turns '' into 0,
 * which is how historical half-era games ended up with third/fourth quarter = 0 and
 * broke every attempt to tell the two formats apart.
 */
const toNullableInt = (value: string | null | undefined): number | null =>
	value === null || value === undefined || value.trim() === '' ? null : +value;

/**
 * Builds the period-score payload. The form only renders the fields matching the
 * game's format, so the other family is left blank and nulls out here — no format
 * check needed.
 */
export const buildPeriodScores = (data: TeamStatsFormData) => ({
	firstQuarter: toNullableInt(data.firstQuarter),
	secondQuarter: toNullableInt(data.secondQuarter),
	thirdQuarter: toNullableInt(data.thirdQuarter),
	fourthQuarter: toNullableInt(data.fourthQuarter),
	firstHalf: toNullableInt(data.firstHalf),
	secondHalf: toNullableInt(data.secondHalf),
	overtime: toNullableInt(data.overtime)
});
