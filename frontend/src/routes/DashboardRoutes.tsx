import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import CreateCoach from '@/components/Dashboard/Coach/CreateCoach';
import EditCoach from '@/components/Dashboard/Coach/EditCoach';
import CreateCompetition from '@/components/Dashboard/Competition/CreateCompetition';
import EditCompetition from '@/components/Dashboard/Competition/EditCompetition';
import Dashboard from '@/components/Dashboard/Dashboard';
import CreateGame from '@/components/Dashboard/Game/CreateGame';
import EditGame from '@/components/Dashboard/Game/EditGame';
import CreatePlayer from '@/components/Dashboard/Player/CreatePlayer';
import EditPlayer from '@/components/Dashboard/Player/EditPlayer';
import CreatePlayerStats from '@/components/Dashboard/PlayerStats/CreatePlayerStats';
import EditPlayerStats from '@/components/Dashboard/PlayerStats/EditPlayerStats';
import CreateReferee from '@/components/Dashboard/Referee/CreateReferee';
import EditReferee from '@/components/Dashboard/Referee/EditReferee';
import CreateStaff from '@/components/Dashboard/Staff/CreateStaff';
import EditStaff from '@/components/Dashboard/Staff/EditStaff';
import CreateTeam from '@/components/Dashboard/Team/CreateTeam';
import EditTeam from '@/components/Dashboard/Team/EditTeam';
import CreateTeamStats from '@/components/Dashboard/TeamStats/CreateTeamStats';
import EditTeamStats from '@/components/Dashboard/TeamStats/EditTeamStats';
import CreateVenue from '@/components/Dashboard/Venue/CreateVenue';
import EditVenue from '@/components/Dashboard/Venue/EditVenue';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

export const dashboardRoutes: RouteObject = {
	path: '/dashboard',
	// ✅ Protect entire dashboard tree
	element: (
		<ProtectedRoute>
			<Dashboard />
		</ProtectedRoute>
	),
	children: [
		{
			index: true,
			element: <Navigate to="player" replace />
		},

		// ✅ Player
		{
			path: 'player',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreatePlayer /> },
				{ path: 'edit', element: <EditPlayer /> }
			]
		},

		// ✅ Coach
		{
			path: 'coach',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateCoach /> },
				{ path: 'edit', element: <EditCoach /> }
			]
		},

		// ✅ Team
		{
			path: 'team',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateTeam /> },
				{ path: 'edit', element: <EditTeam /> }
			]
		},

		// ✅ Referee
		{
			path: 'referee',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateReferee /> },
				{ path: 'edit', element: <EditReferee /> }
			]
		},

		// ✅ Game
		{
			path: 'game',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateGame /> },
				{ path: 'edit', element: <EditGame /> }
			]
		},

		// ✅ Venue
		{
			path: 'venue',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateVenue /> },
				{ path: 'edit', element: <EditVenue /> }
			]
		},

		// ✅ Competition
		{
			path: 'competition',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateCompetition /> },
				{ path: 'edit', element: <EditCompetition /> }
			]
		},

		// ✅ Player Stats
		{
			path: 'player-stats',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreatePlayerStats /> },
				{ path: 'edit', element: <EditPlayerStats /> }
			]
		},

		// ✅ Staff
		{
			path: 'staff',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateStaff /> },
				{ path: 'edit', element: <EditStaff /> }
			]
		},

		// ✅ Team Stats
		{
			path: 'team-stats',
			element: <Outlet />,
			children: [
				{ index: true, element: <Navigate to="create" replace /> },
				{ path: 'create', element: <CreateTeamStats /> },
				{ path: 'edit', element: <EditTeamStats /> }
			]
		}
	]
};
