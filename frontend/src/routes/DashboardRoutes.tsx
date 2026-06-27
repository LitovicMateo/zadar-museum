import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import Dashboard from '@/components/Dashboard/Dashboard';
import CoachFormPage from '@/components/Dashboard/Coach/CoachFormPage';
import CompetitionFormPage from '@/components/Dashboard/Competition/CompetitionFormPage';
import GameFormPage from '@/components/Dashboard/Game/GameFormPage';
import PlayerFormPage from '@/components/Dashboard/Player/PlayerFormPage';
import PlayerStatsFormPage from '@/components/Dashboard/PlayerStats/PlayerStatsFormPage';
import RefereeFormPage from '@/components/Dashboard/Referee/RefereeFormPage';
import StaffFormPage from '@/components/Dashboard/Staff/StaffFormPage';
import TeamFormPage from '@/components/Dashboard/Team/TeamFormPage';
import TeamStatsFormPage from '@/components/Dashboard/TeamStats/TeamStatsFormPage';
import VenueFormPage from '@/components/Dashboard/Venue/VenueFormPage';
import { EntityListPage } from '@/components/Dashboard/EntityListPage/EntityListPage';
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
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

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
  ],
};
