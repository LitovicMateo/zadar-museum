import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import TableWrapper from '@/components/ui/table-wrapper';
import { useSeasonLeagueStats } from '@/hooks/queries/coach/useSeasonLeagueStats';
import { useSeasonTotalStats } from '@/hooks/queries/coach/useSeasonTotalStats';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';
import { CoachStats } from '@/types/api/coach';

import { UniversalTableBody, UniversalTableFooter, UniversalTableHead } from '@/components/ui/table';
import styles from './coach-season-stats.module.css';
import CoachFilterBar from '@/components/coach-page/shared/CoachFilterBar';
import { computeHasNeutralSeason, computeLeagueStatsSeason, computeTotalStatsSeason } from './coach-season-stats.utils';
import { useCoachSeasonStatsTable } from './useCoachSeasonStatsTable';

type CoachSeasonStatsProps = {
  season: string;
};

const CoachSeasonStats: React.FC<CoachSeasonStatsProps> = ({ season }) => {
  const { coachId } = useParams();
  const { db } = useCoachProfileDatabase(coachId!);

  const { data: coachLeagueStats } = useSeasonLeagueStats(coachId!, season, db!);
  const { data: coachTotalStats } = useSeasonTotalStats(coachId!, season, db!);

  // radio group state
  const [coachRole, setCoachRole] = useState<'total' | 'headCoach' | 'assistantCoach'>('total');
  const [location, setLocation] = useState<'total' | 'home' | 'away' | 'neutral'>('total');

  const hasNeutral = useMemo(() => computeHasNeutralSeason(coachLeagueStats, coachRole), [coachLeagueStats, coachRole]);

  useEffect(() => {
    if (!hasNeutral && location === 'neutral') setLocation('total');
  }, [hasNeutral, location]);

  const leagueStats: CoachStats[] = useMemo(() => computeLeagueStatsSeason(coachLeagueStats, coachRole, location), [coachLeagueStats, coachRole, location]);

  const totalStats: CoachStats[] = useMemo(() => computeTotalStatsSeason(coachTotalStats, coachRole, location), [coachTotalStats, coachRole, location]);

  // create table
  const { table } = useCoachSeasonStatsTable(leagueStats, 'league');
  const { table: footTable } = useCoachSeasonStatsTable(totalStats, 'total');

  return (
    <div className={styles.root}>
      {/* radio groups */}
      <div className={styles.radioRow}>
        <CoachFilterBar coachRole={coachRole} setCoachRole={setCoachRole} location={location} setLocation={setLocation} hasNeutral={hasNeutral} />
      </div>

      <TableWrapper>
        <UniversalTableHead table={table} />
        <UniversalTableBody table={table} />
        <UniversalTableFooter table={footTable} variant="light" />
      </TableWrapper>
    </div>
  );
};

export default CoachSeasonStats;
