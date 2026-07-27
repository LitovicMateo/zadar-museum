import { PeriodFormat } from '@/types/api/Game';

/**
 * FIBA replaced two 20-minute halves with four 10-minute quarters for the
 * 2000-01 season, so this is the era boundary for Croatian basketball.
 */
export const QUARTERS_FROM_SEASON = '2000';

/** The format a game in the given season was most likely played in. */
export const periodFormatForSeason = (season: string | undefined): PeriodFormat =>
	season && season < QUARTERS_FROM_SEASON ? 'halves' : 'quarters';

export const isHalves = (format: PeriodFormat | undefined): boolean => format === 'halves';
