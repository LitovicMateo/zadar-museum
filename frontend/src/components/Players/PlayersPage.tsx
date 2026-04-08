import React from 'react';

import NoContent from '@/components/NoContent/NoContent';
import PaginationControls from '@/components/Pagination/PaginationControls';
import PlayerCard from '@/components/Players/PlayerCard/PlayerCard';
import PlayersFilterBar from '@/components/Players/PlayersFilterBar/PlayersFilterBar';
import PlayersLeaders from '@/components/Players/PlayersLeaders/PlayersLeaders';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/UI/DynamicContentWrapper';
import { Skeleton } from '@/components/UI/Skeleton';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { usePlayersFilters } from '@/hooks/UsePlayersFilters';
import { useSearch } from '@/hooks/UseSearch';
import { usePlayersDirectory } from '@/hooks/queries/player/UsePlayersDirectory';

import styles from '@/components/Players/PlayersPage.module.css';

const PAGE_SIZE = 12;

const PlayersPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);
	const { directory, allTimeStats, isLoading } = usePlayersDirectory();
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search players...' });

	const { filtered, position, setPosition, status, setStatus, clearFilters, hasActiveFilters } = usePlayersFilters(
		directory || [],
		searchTerm
	);

	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filtered, undefined, {
		initialPageSize: PAGE_SIZE,
		resetDeps: [searchTerm, position, status]
	});

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, [page]);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<PlayersFilterBar
					SearchInput={SearchInput}
					position={position}
					onPositionChange={setPosition}
					status={status}
					onStatusChange={setStatus}
				/>
				<DynamicContentWrapper>
					<div className={styles.layout}>
						<div className={styles.loadingGrid}>
							{Array.from({ length: 8 }).map((_, i) => (
								<Skeleton key={i} className={styles.skeletonCard} />
							))}
						</div>
						<div>
							{Array.from({ length: 3 }).map((_, i) => (
								<Skeleton key={i} className={styles.skeletonLeader} />
							))}
						</div>
					</div>
				</DynamicContentWrapper>
			</div>
		);
	}

	if (!directory || directory.length === 0) {
		return <NoContent type="info" description="No players in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<DynamicContentWrapper ref={wrapperRef}>
				<PlayersFilterBar
					SearchInput={SearchInput}
					position={position}
					onPositionChange={setPosition}
					status={status}
					onStatusChange={setStatus}
				/>

				<div className={styles.layout}>
					<div className={styles.main}>
						{hasResults ? (
							<>
								<div className={styles.grid}>
									{paginated.map((player) => (
										<PlayerCard key={player.id} player={player} />
									))}
								</div>
								<PaginationControls
									total={total}
									page={page}
									pageSize={pageSize}
									onPageChange={setPage}
									onPageSizeChange={setPageSize}
									pageSizeOptions={[12, 24, 48]}
								/>
							</>
						) : (
							<div className={styles.noResults}>
								<NoContent type="info" description="No players match the current filters." />
								{hasActiveFilters && (
									<button type="button" onClick={clearFilters}>
										Clear filters
									</button>
								)}
							</div>
						)}
					</div>

					<PlayersLeaders stats={allTimeStats} />
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default PlayersPage;
