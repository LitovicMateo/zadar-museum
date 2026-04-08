import React from 'react';
import { useRoutes, RouteObject, Navigate } from 'react-router-dom';

import Coach from '@/components/Coach/CoachPage';
import CoachesPage from '@/components/Coaches/CoachesPage';
import Game from '@/components/Game/Game';
import Games from '@/components/Games/Games';
import Home from '@/components/Home/Home';
import League from '@/components/League/LeaguePage';
import LeaguesPage from '@/components/Leagues/LeaguesPage';
import Login from '@/components/Login/Login';
import Player from '@/components/Player';
import PlayersPage from '@/components/Players/PlayersPage';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import Referee from '@/components/Referee/RefereePage';
import RefereesPage from '@/components/Referees/RefereesPage';
import StaffPage from '@/components/Staff/StaffPage';
import StaffsPage from '@/components/Staffs/StaffsPage';
import TeamPage from '@/components/Team/';
import TeamsPage from '@/components/Teams/TeamsPage';
import Venue from '@/components/Venue//VenuePage';
import VenuesPage from '@/components/Venues/VenuesPage';
import { GamesProvider } from '@/context/GamesContext';
import { TeamGamesProvider } from '@/context/TeamContext';

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

	return useRoutes(routes);
};

export default AppRoutes;
