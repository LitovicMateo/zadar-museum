import { describe, it, expect } from 'vitest';
import { filterSchedule } from './games-utils';
import type { TeamScheduleResponse } from '@/types/api/team';

const sampleSchedule = [
  {
    game_id: 1,
    game_document_id: 'g1',
    game_date: '2026-01-01T00:00:00.000Z',
    season: '2026',
    stage: '',
    round: '',
    league_id: 'L1',
    league_name: 'League 1',
    competition_slug: 'league-1',
    home_team_id: 't1',
    home_team_name: 'KK Zadar',
    home_team_short_name: 'Zadar',
    home_score: null,
    away_team_id: 't2',
    away_team_name: 'Opponent',
    away_team_short_name: 'Opp',
    away_score: null
  },
  {
    game_id: 2,
    game_document_id: 'g2',
    game_date: '2026-01-02T00:00:00.000Z',
    season: '2026',
    stage: '',
    round: '',
    league_id: 'L2',
    league_name: 'League 2',
    competition_slug: 'league-2',
    home_team_id: 't3',
    home_team_name: 'Other Home',
    home_team_short_name: 'Other',
    home_score: null,
    away_team_id: 't4',
    away_team_name: 'Other Away',
    away_team_short_name: 'OtherA',
    away_score: null
  }
] as TeamScheduleResponse[];

describe('filterSchedule', () => {
  it('returns empty array for undefined or empty schedule', () => {
    expect(filterSchedule(undefined, [], '', false)).toEqual([]);
    expect(filterSchedule([], [], '', false)).toEqual([]);
  });

  it('filters by selectedCompetitions when provided', () => {
    const out = filterSchedule(sampleSchedule, ['L1'], '', false);
    expect(out).toHaveLength(1);
    expect(out[0].league_id).toBe('L1');
  });

  it('does not filter by competition when selectedCompetitions is empty', () => {
    const out = filterSchedule(sampleSchedule, [], '', false);
    expect(out).toHaveLength(2);
  });

  it('applies searchTerm only when isZadar is true', () => {
    // searching for 'zadar' should only match first game when isZadar === true
    expect(filterSchedule(sampleSchedule, [], 'zadar', true)).toHaveLength(1);
    // when not isZadar, searchTerm is ignored
    expect(filterSchedule(sampleSchedule, [], 'zadar', false)).toHaveLength(2);
  });
});
