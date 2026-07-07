import { lazy } from 'react';
import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import { playerListConfig } from '@/components/Dashboard/configs/playerListConfig';
import { teamListConfig } from '@/components/Dashboard/configs/teamListConfig';
import { coachListConfig } from '@/components/Dashboard/configs/coachListConfig';
import { refereeListConfig } from '@/components/Dashboard/configs/refereeListConfig';
import { staffListConfig } from '@/components/Dashboard/configs/staffListConfig';
import { gameListConfig } from '@/components/Dashboard/configs/gameListConfig';
import { venueListConfig } from '@/components/Dashboard/configs/venueListConfig';
import { competitionListConfig } from '@/components/Dashboard/configs/competitionListConfig';
import { playerStatsListConfig } from '@/components/Dashboard/configs/playerStatsListConfig';
import { teamStatsListConfig } from '@/components/Dashboard/configs/teamStatsListConfig';
import { leagueTableListConfig } from '@/components/Dashboard/configs/leagueTableListConfig';
import { EntityListPage } from '@/components/Dashboard/EntityListPage/EntityListPage';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

const Dashboard = lazy(() => import('@/components/Dashboard/Dashboard'));
const CoachFormPage = lazy(() => import('@/components/Dashboard/Coach/CoachFormPage'));
const CompetitionFormPage = lazy(() => import('@/components/Dashboard/Competition/CompetitionFormPage'));
const GameFormPage = lazy(() => import('@/components/Dashboard/Game/GameFormPage'));
const PlayerFormPage = lazy(() => import('@/components/Dashboard/Player/PlayerFormPage'));
const PlayerStatsFormPage = lazy(() => import('@/components/Dashboard/PlayerStats/PlayerStatsFormPage'));
const AggregatePlayerStatsFormPage = lazy(
  () => import('@/components/Dashboard/PlayerStats/AggregatePlayerStatsFormPage')
);
const RefereeFormPage = lazy(() => import('@/components/Dashboard/Referee/RefereeFormPage'));
const StaffFormPage = lazy(() => import('@/components/Dashboard/Staff/StaffFormPage'));
const TeamFormPage = lazy(() => import('@/components/Dashboard/Team/TeamFormPage'));
const TeamStatsFormPage = lazy(() => import('@/components/Dashboard/TeamStats/TeamStatsFormPage'));
const LeagueTableFormPage = lazy(() => import('@/components/Dashboard/LeagueTable/LeagueTableFormPage'));
const VenueFormPage = lazy(() => import('@/components/Dashboard/Venue/VenueFormPage'));

export const dashboardRoutes: RouteObject = {
  path: '/dashboard',
  element: (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <Navigate to="player" replace /> },

    {
      path: 'player',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={playerListConfig} /> },
        { path: 'create', element: <PlayerFormPage /> },
        { path: 'edit/:id', element: <PlayerFormPage /> },
      ],
    },

    {
      path: 'coach',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={coachListConfig} /> },
        { path: 'create', element: <CoachFormPage /> },
        { path: 'edit/:id', element: <CoachFormPage /> },
      ],
    },

    {
      path: 'team',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={teamListConfig} /> },
        { path: 'create', element: <TeamFormPage /> },
        { path: 'edit/:id', element: <TeamFormPage /> },
      ],
    },

    {
      path: 'referee',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={refereeListConfig} /> },
        { path: 'create', element: <RefereeFormPage /> },
        { path: 'edit/:id', element: <RefereeFormPage /> },
      ],
    },

    {
      path: 'game',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={gameListConfig} /> },
        { path: 'create', element: <GameFormPage /> },
        { path: 'edit/:id', element: <GameFormPage /> },
      ],
    },

    {
      path: 'venue',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={venueListConfig} /> },
        { path: 'create', element: <VenueFormPage /> },
        { path: 'edit/:id', element: <VenueFormPage /> },
      ],
    },

    {
      path: 'competition',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={competitionListConfig} /> },
        { path: 'create', element: <CompetitionFormPage /> },
        { path: 'edit/:id', element: <CompetitionFormPage /> },
      ],
    },

    {
      path: 'player-stats',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={playerStatsListConfig} /> },
        { path: 'create', element: <PlayerStatsFormPage /> },
        { path: 'edit/:id', element: <PlayerStatsFormPage /> },
        { path: 'aggregate/create', element: <AggregatePlayerStatsFormPage /> },
        { path: 'aggregate/edit/:id', element: <AggregatePlayerStatsFormPage /> },
      ],
    },

    {
      path: 'staff',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={staffListConfig} /> },
        { path: 'create', element: <StaffFormPage /> },
        { path: 'edit/:id', element: <StaffFormPage /> },
      ],
    },

    {
      path: 'team-stats',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={teamStatsListConfig} /> },
        { path: 'create', element: <TeamStatsFormPage /> },
        { path: 'edit/:id', element: <TeamStatsFormPage /> },
      ],
    },

    {
      path: 'league-table',
      element: <Outlet />,
      children: [
        { index: true, element: <Navigate to="list" replace /> },
        { path: 'list', element: <EntityListPage config={leagueTableListConfig} /> },
        { path: 'create', element: <LeagueTableFormPage /> },
        { path: 'edit/:id', element: <LeagueTableFormPage /> },
      ],
    },
  ],
};
