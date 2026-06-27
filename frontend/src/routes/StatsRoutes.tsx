import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';

const CoachStats = lazy(() => import('@/components/Stats/CoachStats/CoachStats'));
const ComparePage = lazy(() => import('@/components/Stats/Compare/ComparePage'));
const PlayerRecords = lazy(() => import('@/components/Stats/PlayerRecords/PlayerRecords'));
const PlayerStats = lazy(() => import('@/components/Stats/PlayerStats/PlayerStats'));
const RefereeStats = lazy(() => import('@/components/Stats/RefereeStats/RefereeStats'));
const Stats = lazy(() => import('@/components/Stats/Stats'));
const TeamRecords = lazy(() => import('@/components/Stats/TeamRecords/TeamRecords'));
const TeamStats = lazy(() => import('@/components/Stats/TeamStats/TeamStats'));

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
		},
		{
			path: 'compare',
			element: <ComparePage />
		}
	]
};
