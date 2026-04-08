import { Navigate, RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import CoachStats from '@/components/Stats/CoachStats/CoachStats';
import PlayerRecords from '@/components/Stats/PlayerRecords/PlayerRecords';
import PlayerStats from '@/components/Stats/PlayerStats/PlayerStats';
import RefereeStats from '@/components/Stats/RefereeStats/RefereeStats';
import Stats from '@/components/Stats/Stats';
import TeamRecords from '@/components/Stats/TeamRecords/TeamRecords';
import TeamStats from '@/components/Stats/TeamStats/TeamStats';

export const statsRoutes: RouteObject = {
	path: '/stats',
	element: (
		<ProtectedRoute>
			<Stats />
		</ProtectedRoute>
	),
	children: [
		{
			index: true,
			element: <Navigate to="player" replace />
		},
		{
			path: 'team',
			element: <TeamStats />
		},
		{
			path: 'team-records',
			element: <TeamRecords />
		},
		{
			path: 'player',
			element: <PlayerStats />
		},
		{
			path: 'player-records',
			element: <PlayerRecords />
		},
		{
			path: 'coach',
			element: <CoachStats />
		},
		{
			path: 'referee',
			element: <RefereeStats />
		}
	]
};
