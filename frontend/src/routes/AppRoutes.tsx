import React, { lazy, Suspense } from 'react';
import { useRoutes, RouteObject, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { GamesProvider } from '@/context/GamesContext';
import { TeamGamesProvider } from '@/context/TeamContext';

const Coach = lazy(() => import('@/components/Coach/CoachPage'));
const CoachesPage = lazy(() => import('@/components/Coaches/CoachesPage'));
const Game = lazy(() => import('@/components/Game/Game'));
const Games = lazy(() => import('@/components/Games/Games'));
const Home = lazy(() => import('@/components/Home/Home'));
const League = lazy(() => import('@/components/League/LeaguePage'));
const LeaguesPage = lazy(() => import('@/components/Leagues/LeaguesPage'));
const Login = lazy(() => import('@/components/Login/Login'));
const Player = lazy(() => import('@/components/Player'));
const PlayersPage = lazy(() => import('@/components/Players/PlayersPage'));
const Referee = lazy(() => import('@/components/Referee/RefereePage'));
const RefereesPage = lazy(() => import('@/components/Referees/RefereesPage'));
const StaffPage = lazy(() => import('@/components/Staff/StaffPage'));
const StaffsPage = lazy(() => import('@/components/Staffs/StaffsPage'));
const TeamPage = lazy(() => import('@/components/Team/'));
const TeamsPage = lazy(() => import('@/components/Teams/TeamsPage'));
const Venue = lazy(() => import('@/components/Venue//VenuePage'));
const VenuesPage = lazy(() => import('@/components/Venues/VenuesPage'));

import { dashboardRoutes } from './DashboardRoutes';
import { statsRoutes } from './StatsRoutes';

const protect = (element: React.ReactNode) => <ProtectedRoute>{element}</ProtectedRoute>;

const AppRoutes: React.FC = () => {
	const routes: RouteObject[] = [
		{
			path: '/',
			element: protect(<Home />)
		},
		{
			path: '/login',
			element: <Login />
		},

		// Players
		{
			path: '/players',
			element: protect(<PlayersPage />)
		},
		{
			path: '/player/:playerId',
			element: protect(<Player />)
		},

		// Games
		{
			path: '/games',
			element: protect(
				<GamesProvider>
					<Games />
				</GamesProvider>
			)
		},
		{
			path: '/game/:gameId',
			element: protect(<Game />)
		},

		// Referees
		{
			path: '/referees',
			element: protect(<RefereesPage />)
		},
		{
			path: '/referee/:refereeId',
			element: protect(<Referee />)
		},

		// Staff
		{
			path: '/staffs',
			element: protect(<StaffsPage />)
		},
		{
			path: '/staff/:staffId',
			element: protect(<StaffPage />)
		},

		// Teams
		{
			path: '/teams',
			element: protect(<TeamsPage />)
		},
		{
			path: '/team/:teamSlug',
			element: protect(
				<TeamGamesProvider>
					<TeamPage />
				</TeamGamesProvider>
			)
		},

		// Leagues
		{
			path: '/leagues',
			element: protect(<LeaguesPage />)
		},
		{
			path: '/league/:leagueSlug',
			element: protect(<League />)
		},

		// Coaches
		{
			path: '/coaches',
			element: protect(<CoachesPage />)
		},
		{
			path: '/coach/:coachId',
			element: protect(<Coach />)
		},

		// Venues
		{
			path: '/venues',
			element: protect(<VenuesPage />)
		},
		{
			path: '/venue/:venueSlug',
			element: protect(<Venue />)
		},

		// Dashboard (protected as whole subtree)
		{
			...dashboardRoutes,
			element: protect(dashboardRoutes.element)
		},

		// Stats (protected as whole subtree)
		{
			...statsRoutes,
			element: protect(statsRoutes.element)
		},
		// Catch-all: redirect unmatched routes to home
		{
			path: '*',
			element: <Navigate to="/" replace />
		}
	];

	const element = useRoutes(routes);
	return <Suspense fallback={null}>{element}</Suspense>;
};

export default AppRoutes;
