import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import slugify from 'react-slugify';

import { APP_ROUTES } from '@/constants/Routes';
import { useSearch } from '@/hooks/UseSearch';
import { useCoaches } from '@/hooks/queries/coach/UseCoaches';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { usePlayers } from '@/hooks/queries/player/UsePlayers';
import { useReferees } from '@/hooks/queries/referee/UseReferees';
import { useTeams } from '@/hooks/queries/team/UseTeams';
import { useVenues } from '@/hooks/queries/venue/UseVenues';
import {
	searchCoaches,
	searchLeagues,
	searchPlayers,
	searchReferees,
	searchTeams,
	searchVenues
} from '@/utils/SearchFunctions';

import Portal from './Portal';
import Result from './Result';
import ResultContainer from './ResultContainer';

import styles from './GlobalSearch.module.css';

const GlobalSearch: React.FC = () => {
	const [activeIndex, setActiveIndex] = useState(-1);
	const navigate = useNavigate();

	// Stable refs to avoid stale closures in the keyboard handler
	const activeIndexRef = useRef(-1);
	const navigationItemsRef = useRef<{ url: string }[]>([]);
	const clearSearchRef = useRef<() => void>(() => {});

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			switch (e.key) {
				case 'ArrowDown':
					e.preventDefault();
					if (navigationItemsRef.current.length > 0) {
						setActiveIndex((i) => (i + 1) % navigationItemsRef.current.length);
					}
					break;
				case 'ArrowUp':
					e.preventDefault();
					if (navigationItemsRef.current.length > 0) {
						setActiveIndex(
							(i) => (i - 1 + navigationItemsRef.current.length) % navigationItemsRef.current.length
						);
					}
					break;
				case 'Enter': {
					const item = navigationItemsRef.current[activeIndexRef.current];
					if (item) {
						navigate(item.url);
						clearSearchRef.current();
					}
					break;
				}
				case 'Escape':
					clearSearchRef.current();
					break;
			}
		},
		[navigate]
	);

	const { SearchInput, debouncedTerm, showPortal, clearSearch, inputRef } = useSearch({
		placeholder: 'Search',
		className: 'w-full max-w-[300px] rounded-[6px] !border-[#194F95] border-1 h-[32px]',
		onKeyDown: handleKeyDown
	});

	// Keep refs in sync on every render
	clearSearchRef.current = clearSearch;
	activeIndexRef.current = activeIndex;

	const term = useMemo(() => slugify(debouncedTerm, { delimiter: ' ' }), [debouncedTerm]);

	// Reset active selection when the search term changes
	useEffect(() => {
		setActiveIndex(-1);
	}, [term]);

	const { data: players } = usePlayers('last_name', 'asc');
	const { data: teams } = useTeams('slug', 'asc');
	const { data: coaches } = useCoaches('last_name', 'asc');
	const { data: venues } = useVenues('slug', 'asc');
	const { data: referees } = useReferees('last_name', 'asc');
	const { data: leagues } = useCompetitions('slug', 'asc');

	const allDataReady = !!(players && teams && coaches && venues && referees && leagues);

	const filteredPlayers = useMemo(() => (players ? searchPlayers(players, term).slice(0, 5) : []), [players, term]);
	const filteredTeams = useMemo(() => (teams ? searchTeams(teams, term).slice(0, 5) : []), [teams, term]);
	const filteredCoaches = useMemo(() => (coaches ? searchCoaches(coaches, term).slice(0, 5) : []), [coaches, term]);
	const filteredVenues = useMemo(() => (venues ? searchVenues(venues, term).slice(0, 5) : []), [venues, term]);
	const filteredReferees = useMemo(
		() => (referees ? searchReferees(referees, term).slice(0, 5) : []),
		[referees, term]
	);
	const filteredLeagues = useMemo(() => (leagues ? searchLeagues(leagues, term).slice(0, 5) : []), [leagues, term]);

	// Flat list used for keyboard navigation — order mirrors render order below
	const navigationItems = useMemo(
		() => [
			...filteredPlayers.map((p) => ({ url: APP_ROUTES.player(p.documentId) })),
			...filteredTeams.map((t) => ({ url: APP_ROUTES.team(t.slug) })),
			...filteredCoaches.map((c) => ({ url: APP_ROUTES.coach(c.documentId) })),
			...filteredVenues.map((v) => ({ url: APP_ROUTES.venue(v.slug) })),
			...filteredReferees.map((r) => ({ url: APP_ROUTES.referee(r.documentId) })),
			...filteredLeagues.map((l) => ({ url: APP_ROUTES.league(l.slug) }))
		],
		[filteredPlayers, filteredTeams, filteredCoaches, filteredVenues, filteredReferees, filteredLeagues]
	);

	navigationItemsRef.current = navigationItems;

	// Offsets for computing per-item isActive — derived from already-memoized arrays
	const teamStart = filteredPlayers.length;
	const coachStart = teamStart + filteredTeams.length;
	const venueStart = coachStart + filteredCoaches.length;
	const refereeStart = venueStart + filteredVenues.length;
	const leagueStart = refereeStart + filteredReferees.length;

	const noResults = navigationItems.length === 0;

	return (
		<div className={styles.wrapper}>
			<div className={styles.inputWrap}>{SearchInput}</div>
			{showPortal && (
				<Portal anchorRef={inputRef}>
					{!allDataReady && <p className={styles.message}>Loading…</p>}

					{allDataReady && noResults && <p className={styles.message}>No results found</p>}

					{allDataReady && filteredPlayers.length > 0 && (
						<ResultContainer title="Players">
							{filteredPlayers.map((player, i) => (
								<Result
									key={player.documentId}
									item={`${player.first_name} ${player.last_name}`}
									url={APP_ROUTES.player(player.documentId)}
									clearSearch={clearSearch}
									isActive={activeIndex === i}
								/>
							))}
						</ResultContainer>
					)}

					{allDataReady && filteredTeams.length > 0 && (
						<ResultContainer title="Teams">
							{filteredTeams.map((team, i) => (
								<Result
									key={team.documentId}
									item={team.name}
									url={APP_ROUTES.team(team.slug)}
									clearSearch={clearSearch}
									isActive={activeIndex === teamStart + i}
								/>
							))}
						</ResultContainer>
					)}

					{allDataReady && filteredCoaches.length > 0 && (
						<ResultContainer title="Coaches">
							{filteredCoaches.map((coach, i) => (
								<Result
									key={coach.documentId}
									item={`${coach.first_name} ${coach.last_name}`}
									url={APP_ROUTES.coach(coach.documentId)}
									clearSearch={clearSearch}
									isActive={activeIndex === coachStart + i}
								/>
							))}
						</ResultContainer>
					)}

					{allDataReady && filteredVenues.length > 0 && (
						<ResultContainer title="Venues">
							{filteredVenues.map((venue, i) => (
								<Result
									key={venue.documentId}
									item={venue.name}
									url={APP_ROUTES.venue(venue.slug)}
									clearSearch={clearSearch}
									isActive={activeIndex === venueStart + i}
								/>
							))}
						</ResultContainer>
					)}

					{allDataReady && filteredReferees.length > 0 && (
						<ResultContainer title="Referees">
							{filteredReferees.map((referee, i) => (
								<Result
									key={referee.documentId}
									item={`${referee.first_name} ${referee.last_name}`}
									url={APP_ROUTES.referee(referee.documentId)}
									clearSearch={clearSearch}
									isActive={activeIndex === refereeStart + i}
								/>
							))}
						</ResultContainer>
					)}

					{allDataReady && filteredLeagues.length > 0 && (
						<ResultContainer title="Leagues">
							{filteredLeagues.map((league, i) => (
								<Result
									key={league.documentId}
									item={league.name}
									url={APP_ROUTES.league(league.slug)}
									clearSearch={clearSearch}
									isActive={activeIndex === leagueStart + i}
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
