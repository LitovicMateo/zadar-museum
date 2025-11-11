import React from 'react';
import { useRoutes, RouteObject } from 'react-router-dom';

import { GamesProvider } from '@/context/games-context';
import { TeamGamesProvider } from '@/context/team-context';
import Coach from '@/pages/Coach/Coach';
import CoachesPage from '@/pages/Coaches/CoachesPage';
import Game from '@/pages/Game/Game';
import Games from '@/pages/Games/Games';
import Home from '@/pages/Home/Home';
import League from '@/pages/League/League';
import LeaguesPage from '@/pages/Leagues/LeaguesPage';
import Login from '@/pages/Login/Login';
import Player from '@/pages/Player/Player';
import PlayersPage from '@/pages/Players/PlayersPage';
import Referee from '@/pages/Referee/Referee';
import RefereesPage from '@/pages/Referees/RefereesPage';
import Staff from '@/pages/Staff/Staff';
import StaffsPage from '@/pages/Staffs/StaffsPage';
import TeamPage from '@/pages/Team/TeamPage';
import TeamsPage from '@/pages/Teams/TeamsPage';
import Venue from '@/pages/Venue/Venue';
import VenuesPage from '@/pages/Venues/VenuesPage';

import ProtectedRoute from '../protected-route/protected-route';
import { dashboardRoutes } from './dashboard-routes';
import { statsRoutes } from './stats-routes';

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
			element: protect(<Staff />)
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
		}
	];

	return useRoutes(routes);
};

export default AppRoutes;
