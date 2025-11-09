import { Navigate, RouteObject } from 'react-router-dom';

import CoachStats from '@/pages/Stats/CoachStats/CoachStats';
import PlayerRecords from '@/pages/Stats/PlayerRecords/PlayerRecords';
import PlayerStats from '@/pages/Stats/PlayerStats/PlayerStats';
import RefereeStats from '@/pages/Stats/RefereeStats/RefereeStats';
import Stats from '@/pages/Stats/Stats';
import TeamRecords from '@/pages/Stats/TeamRecords/TeamRecords';
import TeamStats from '@/pages/Stats/TeamStats/TeamStats';

import ProtectedRoute from '../protected-route/protected-route';

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
