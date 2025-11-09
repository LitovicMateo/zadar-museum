import slugify from 'react-slugify';

import { APP_ROUTES } from '@/constants/routes';
import { useCoaches } from '@/hooks/queries/coach/useCoaches';
import { useCompetitions } from '@/hooks/queries/dasboard/useCompetitions';
import { usePlayers } from '@/hooks/queries/player/usePlayers';
import { useReferees } from '@/hooks/queries/referee/useReferees';
import { useTeams } from '@/hooks/queries/team/useTeams';
import { useVenues } from '@/hooks/queries/venue/useVenues';
import { useSearch } from '@/hooks/useSearch';
import {
	searchCoaches,
	searchLeagues,
	searchPlayers,
	searchReferees,
	searchTeams,
	searchVenues
} from '@/utils/search-functions';

import Portal from './portal';
import Result from './result';
import ResultContainer from './result-container';

const GlobalSearch: React.FC = () => {
	const { SearchInput, searchTerm, showPortal, clearSearch } = useSearch({
		placeholder: 'Search',
		className: 'w-[300px] rounded-[6px] !border-[#194F95] border-1 h-[32px] '
	});

	const term = slugify(searchTerm, { delimiter: ' ' });

	// players
	const { data: players } = usePlayers('last_name', 'asc');
	const { data: teams } = useTeams('slug', 'asc');
	const { data: coaches } = useCoaches('last_name', 'asc');
	const { data: venues } = useVenues('slug', 'asc');
	const { data: referees } = useReferees('last_name', 'asc');
	const { data: leagues } = useCompetitions('slug', 'asc');

	if (!players || !teams || !coaches || !venues || !referees || !leagues) return null;

	const filteredPlayers = searchPlayers(players, term).slice(0, 5);
	const filteredTeams = searchTeams(teams, term).slice(0, 5);
	const filteredCoaches = searchCoaches(coaches, term).slice(0, 5);
	const filteredVenues = searchVenues(venues, term).slice(0, 5);
	const filteredReferees = searchReferees(referees, term).slice(0, 5);
	const filteredLeagues = searchLeagues(leagues, term).slice(0, 5);

	const noResults =
		[
			...filteredPlayers,
			...filteredTeams,
			...filteredCoaches,
			...filteredVenues,
			...filteredReferees,
			...filteredLeagues
		].length === 0;

	return (
		<div className="flex gap-4 relative">
			{SearchInput}
			{showPortal && !noResults && (
				<Portal>
					{filteredPlayers && filteredPlayers?.length > 0 && (
						<ResultContainer title="Players">
							{filteredPlayers.map((player) => (
								<Result
									key={player.id}
									item={player.first_name + ' ' + player.last_name}
									url={APP_ROUTES.player(player.documentId)}
									clearSearch={clearSearch}
								/>
							))}
						</ResultContainer>
					)}
					{filteredTeams && filteredTeams?.length > 0 && (
						<ResultContainer title="Teams">
							{filteredTeams.map((team) => (
								<Result
									key={team.documentId}
									item={team.name}
									url={APP_ROUTES.team(team.slug)}
									clearSearch={clearSearch}
								/>
							))}
						</ResultContainer>
					)}
					{filteredCoaches && filteredCoaches?.length > 0 && (
						<ResultContainer title="Coaches">
							{filteredCoaches.map((coach) => (
								<Result
									key={coach.documentId}
									item={`${coach.first_name} ${coach.last_name}`}
									url={APP_ROUTES.coach(coach.documentId)}
									clearSearch={clearSearch}
								/>
							))}
						</ResultContainer>
					)}

					{filteredVenues && filteredVenues?.length > 0 && (
						<ResultContainer title="Venues">
							{filteredVenues.map((venue) => (
								<Result
									key={venue.documentId}
									item={venue.name}
									url={APP_ROUTES.venue(venue.slug)}
									clearSearch={clearSearch}
								/>
							))}
						</ResultContainer>
					)}

					{filteredReferees && filteredReferees?.length > 0 && (
						<ResultContainer title="Referees">
							{filteredReferees.map((referee) => (
								<Result
									key={referee.documentId}
									item={`${referee.first_name} ${referee.last_name}`}
									url={APP_ROUTES.referee(referee.documentId)}
									clearSearch={clearSearch}
								/>
							))}
						</ResultContainer>
					)}

					{filteredLeagues && filteredLeagues?.length > 0 && (
						<ResultContainer title="Leagues">
							{filteredLeagues.map((league) => (
								<Result
									key={league.documentId}
									item={league.name}
									url={APP_ROUTES.league(league.slug)}
									clearSearch={clearSearch}
								/>
							))}
						</ResultContainer>
					)}
				</Portal>
			)}
		</div>
	);
};

export default GlobalSearch;
