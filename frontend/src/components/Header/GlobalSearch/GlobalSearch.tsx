import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useSearch } from '@/hooks/UseSearch';
import { useGlobalSearch } from '@/hooks/queries/UseGlobalSearch';

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
		className: 'w-full max-w-[300px] rounded-[6px] !border-court border-1 h-[32px]',
		onKeyDown: handleKeyDown
	});

	// Keep refs in sync on every render
	clearSearchRef.current = clearSearch;
	activeIndexRef.current = activeIndex;

	const { data, isLoading } = useGlobalSearch(debouncedTerm);

	const players = data?.players ?? [];
	const teams = data?.teams ?? [];
	const coaches = data?.coaches ?? [];
	const venues = data?.venues ?? [];
	const referees = data?.referees ?? [];
	const competitions = data?.competitions ?? [];

	const navigationItems = useMemo(() => [
			...players.map((p) => ({ url: APP_ROUTES.player(p.documentId) })),
			...teams.map((t) => ({ url: APP_ROUTES.team(t.slug) })),
			...coaches.map((c) => ({ url: APP_ROUTES.coach(c.documentId) })),
			...venues.map((v) => ({ url: APP_ROUTES.venue(v.slug) })),
			...referees.map((r) => ({ url: APP_ROUTES.referee(r.documentId) })),
		...competitions.map((l) => ({ url: APP_ROUTES.league(l.slug) }))
	], [players, teams, coaches, venues, referees, competitions]);

	useEffect(() => {
		setActiveIndex(-1);
	}, [data]);

	navigationItemsRef.current = navigationItems;

	// Offsets for computing per-item isActive — derived from result arrays
	const teamStart = players.length;
	const coachStart = teamStart + teams.length;
	const venueStart = coachStart + coaches.length;
	const refereeStart = venueStart + venues.length;
	const leagueStart = refereeStart + referees.length;

	const noResults = !isLoading && navigationItems.length === 0;

	return (
		<div className={styles.wrapper}>
			<div className={styles.inputWrap}>{SearchInput}</div>
			{showPortal && (
				<Portal anchorRef={inputRef}>
					{isLoading && <p className={styles.message}>Loading…</p>}

					{noResults && <p className={styles.message}>No results found</p>}

					{players.length > 0 && (
						<ResultContainer title="Players">
							{players.map((player, i) => (
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

					{teams.length > 0 && (
						<ResultContainer title="Teams">
							{teams.map((team, i) => (
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

					{coaches.length > 0 && (
						<ResultContainer title="Coaches">
							{coaches.map((coach, i) => (
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

					{venues.length > 0 && (
						<ResultContainer title="Venues">
							{venues.map((venue, i) => (
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

					{referees.length > 0 && (
						<ResultContainer title="Referees">
							{referees.map((referee, i) => (
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

					{competitions.length > 0 && (
						<ResultContainer title="Leagues">
							{competitions.map((league, i) => (
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
