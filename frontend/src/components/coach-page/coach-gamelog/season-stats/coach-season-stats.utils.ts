import { CoachStatsResponse, CoachStats } from '@/types/api/coach';

export type CoachRole = 'total' | 'headCoach' | 'assistantCoach';
export type MatchLocation = 'total' | 'home' | 'away' | 'neutral';

export const computeHasNeutralSeason = (
  coachLeagueStats: CoachStatsResponse[] | undefined,
  coachRole: CoachRole
) => {
  if (!coachLeagueStats) return false;
  return coachLeagueStats.some((row: CoachStatsResponse) => (row[coachRole]?.neutral?.games ?? 0) > 0);
};

export const computeLeagueStatsSeason = (
  coachLeagueStats: CoachStatsResponse[] | undefined,
  coachRole: CoachRole,
  location: MatchLocation
) => {
  if (!coachLeagueStats) return [] as CoachStats[];
  return coachLeagueStats
    .map((row: CoachStatsResponse) => row[coachRole]?.[location])
    .filter(Boolean) as CoachStats[];
};

export const computeTotalStatsSeason = (
  coachTotalStats: any,
  coachRole: CoachRole,
  location: MatchLocation
) => {
  if (!coachTotalStats) return [] as CoachStats[];
  return [coachTotalStats[coachRole]?.[location]];
};

export default {};
