import React, { useEffect, useState } from 'react';

import PaginationControls from '@/components/pagination/PaginationControls';
import PlayerStatsFilter from '@/components/player-stats/filter/PlayerStatsFilter';
import PlayerStatsTable from '@/components/player-stats/table/PlayerStatsTable';
import { usePlayerAllTimeStats } from '@/hooks/queries/stats/usePlayerAllTimeStats';
import usePagedSortedList from '@/hooks/usePagedSortedList';
import { useSearch } from '@/hooks/useSearch';
import { PlayerDB } from '@/pages/Player/Player';
import { PlayerAllTimeStats } from '@/types/api/player';
import { searchPlayerStats } from '@/utils/search-functions';
import { SortingState } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';

import PageWrapper from '../UI/PageWrapper';

const PlayerStats: React.FC = () => {
	const [database, setDatabase] = React.useState<PlayerDB>('zadar');
	const [stats, setStats] = React.useState<'total' | 'average'>('total');
	const [location, setLocation] = React.useState<'home' | 'away' | 'all'>('all');
	const [league, setLeague] = React.useState<string>('all');
	const [season, setSeason] = React.useState<string>('all');

	const [sorting, setSorting] = React.useState<SortingState>([
		{
			id: 'points',
			desc: true
		}
	]);

	const { SearchInput, searchTerm } = useSearch({
		placeholder: 'Search by player name'
	});

	const { data: players } = usePlayerAllTimeStats(database, stats, location, league, season);
	const filteredPlayers = searchPlayerStats(players?.current, searchTerm);

	const {
		paginated: paginatedPlayers,
		total,
		page,
		pageSize,
		setPage,
		setPageSize
	} = usePagedSortedList<PlayerAllTimeStats>(filteredPlayers, sorting, {
		initialPage: 1,
		initialPageSize: 10,
		resetDeps: [searchTerm, database, stats, location, league, season, JSON.stringify(sorting)]
	});

	// Filter previous dataset to only include players visible on current page
	const paginatedPrev = players?.previous
		? players.previous.filter((p) =>
				paginatedPlayers?.some((pp: PlayerAllTimeStats) => pp.player_id === p.player_id)
			)
		: undefined;

	const handleSetDatabase = React.useCallback((db: PlayerDB) => setDatabase(db), []);
	const handleSetStats = React.useCallback((s: 'total' | 'average') => setStats(s), []);
	const handleSetLocation = React.useCallback((loc: 'home' | 'away' | 'all') => setLocation(loc), []);
	const handleSetLeague = React.useCallback((lg: string) => setLeague(lg), []);
	const handleSetSeason = React.useCallback((ssn: string) => setSeason(ssn), []);

	const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
	const [showFilters, setShowFilters] = useState<boolean>(false);

	useEffect(() => {
		const onResize = () => setIsMobile(window.innerWidth <= 768);
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return (
		<PageWrapper>
			{/* On desktop/tablet show inline filter; on mobile show a button that opens a bottom sheet */}
			{!isMobile ? (
				<PlayerStatsFilter
					database={database}
					setDatabase={handleSetDatabase}
					stats={stats}
					setStats={handleSetStats}
					location={location}
					setLocation={handleSetLocation}
					league={league}
					setLeague={handleSetLeague}
					season={season}
					setSeason={handleSetSeason}
				/>
			) : (
				<div className="flex items-center gap-2 mb-2">
					<button
						className=" !bg-indigo-600 hover:!bg-indigo-700 active:!bg-indigo-800 !text-white px-4 py-1 rounded-[4px] shadow-sm focus:outline-none focus:!ring-2 focus:!ring-indigo-300"
						onClick={() => setShowFilters(true)}
						aria-expanded={showFilters}
					>
						Filters
					</button>
					<div className="flex-1">{SearchInput}</div>
				</div>
			)}

			<PaginationControls
				total={total}
				page={page}
				pageSize={pageSize}
				onPageChange={setPage}
				onPageSizeChange={setPageSize}
			/>

			<PlayerStatsTable stats={paginatedPlayers} prev={paginatedPrev} sorting={sorting} setSorting={setSorting} />

			{/* Mobile bottom-sheet modal for filters with framer-motion animations */}
			<AnimatePresence>
				{isMobile && showFilters && (
					<motion.div
						className="fixed inset-0 z-50 flex items-end"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						key="player-stats-modal-outer"
					>
						<motion.div
							className="absolute inset-0 bg-black/50"
							onClick={() => setShowFilters(false)}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.18 }}
						/>

						<motion.div
							className="relative w-full bg-white rounded-t-xl p-4 max-h-[80vh] overflow-auto player-stats-modal"
							initial={{ y: '100%' }}
							animate={{ y: 0 }}
							exit={{ y: '100%' }}
							transition={{ type: 'spring', stiffness: 300, damping: 30 }}
							key="player-stats-modal-sheet"
						>
							<style>{`.player-stats-modal button{background-color:#4f46e5 !important;color:#fff !important;border-radius:4px !important}`}</style>
							<div className="flex items-center justify-between mb-3">
								<h3 className="text-lg font-medium">Filters</h3>
								<button
									className=" !bg-indigo-600 hover:!bg-indigo-700 active:!bg-indigo-800 !text-white px-3 py-1 rounded-[4px] shadow-sm focus:outline-none focus:!ring-2 focus:!ring-indigo-300"
									onClick={() => setShowFilters(false)}
									aria-label="Close filters"
								>
									Close
								</button>
							</div>
							<PlayerStatsFilter
								database={database}
								setDatabase={handleSetDatabase}
								stats={stats}
								setStats={handleSetStats}
								location={location}
								setLocation={handleSetLocation}
								league={league}
								setLeague={handleSetLeague}
								season={season}
								setSeason={handleSetSeason}
							/>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</PageWrapper>
	);
};

export default PlayerStats;
