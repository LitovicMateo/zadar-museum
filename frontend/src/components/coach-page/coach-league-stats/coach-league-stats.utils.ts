import { CoachStats } from '@/types/api/coach';

export const computeHasNeutral = (coachLeagueStats: unknown[] | undefined, coachRole: string) => {
  if (!coachLeagueStats || coachLeagueStats.length === 0) return false;
  return coachLeagueStats.some((row) => {
    const r = row as unknown as Record<string, Record<string, CoachStats | undefined>>;
    return (r[coachRole]?.neutral?.games ?? 0) > 0;
  });
};

export const computeLeagueStats = (
  coachLeagueStats: unknown[] | undefined,
  coachRole: string,
  location: string
) => {
  if (!coachLeagueStats) return [] as CoachStats[];
  return coachLeagueStats
    .map((row) => {
      const r = row as unknown as Record<string, Record<string, CoachStats | undefined>>;
      return r[coachRole]?.[location];
    })
    .filter(Boolean) as CoachStats[];
};

export const computeTotalStats = (coachRecord: unknown | undefined, coachRole: string, location: string) => {
  if (!coachRecord) return [] as CoachStats[];
  const r = coachRecord as unknown as Record<string, Record<string, CoachStats | undefined>>;
  const v = r[coachRole]?.[location];
  return v ? [v] : [];
};

export default {};
