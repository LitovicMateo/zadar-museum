import { Navigate, Outlet, RouteObject } from 'react-router-dom';

import CreateCoach from '@/pages/Dashboard/Coach/CreateCoach';
import EditCoach from '@/pages/Dashboard/Coach/EditCoach';
import CreateCompetition from '@/pages/Dashboard/Competition/CreateCompetition';
import EditCompetition from '@/pages/Dashboard/Competition/EditCompetition';
import Dashboard from '@/pages/Dashboard/Dashboard';
import CreateGame from '@/pages/Dashboard/Game/CreateGame';
import EditGame from '@/pages/Dashboard/Game/EditGame';
import CreatePlayer from '@/pages/Dashboard/Player/CreatePlayer';
import EditPlayer from '@/pages/Dashboard/Player/EditPlayer';
import CreatePlayerStats from '@/pages/Dashboard/PlayerStats/CreatePlayerStats';
import EditPlayerStats from '@/pages/Dashboard/PlayerStats/EditPlayerStats';
import CreateReferee from '@/pages/Dashboard/Referee/CreateReferee';
import EditReferee from '@/pages/Dashboard/Referee/EditReferee';
import CreateStaff from '@/pages/Dashboard/Staff/CreateStaff';
import EditStaff from '@/pages/Dashboard/Staff/EditStaff';
import CreateTeam from '@/pages/Dashboard/Team/CreateTeam';
import EditTeam from '@/pages/Dashboard/Team/EditTeam';
import CreateTeamStats from '@/pages/Dashboard/TeamStats/CreateTeamStats';
import EditTeamStats from '@/pages/Dashboard/TeamStats/EditTeamStats';
import CreateVenue from '@/pages/Dashboard/Venue/CreateVenue';
import EditVenue from '@/pages/Dashboard/Venue/EditVenue';

import ProtectedRoute from '../protected-route/protected-route';

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
