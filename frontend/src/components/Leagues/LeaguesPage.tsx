import React from 'react';

import LeagueCard from '@/components/Leagues/LeagueCard/LeagueCard';
import LeagueFilterBar from '@/components/Leagues/LeagueFilterBar/LeagueFilterBar';
import NoContent from '@/components/NoContent/NoContent';
import PaginationControls from '@/components/Pagination/PaginationControls';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/UI/DynamicContentWrapper';
import { Skeleton } from '@/components/UI/Skeleton';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useCompetitionsDirectory } from '@/hooks/queries/league/useCompetitionsDirectory';
import { CompetitionDirectoryEntry } from '@/types/api/Competition';
import { searchLeagues } from '@/utils/SearchFunctions';

import styles from '@/components/Leagues/LeaguesPage.module.css';

const PAGE_SIZE = 12;

const LeaguesPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);

	const { directory, isLoading } = useCompetitionsDirectory();
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search leagues...' });

	const filteredLeagues = searchLeagues(directory as never[], searchTerm) as unknown as CompetitionDirectoryEntry[];
	const { page, pageSize, setPage, setPageSize, total, paginated } = usePagedSortedList(filteredLeagues, undefined, {
		initialPageSize: PAGE_SIZE,
		resetDeps: [searchTerm]
	});

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, [page, pageSize, searchTerm]);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<div className={styles.pageHeaderInner}>
						<h1 className={styles.pageTitle}>Competitions</h1>
					</div>
				</div>
				<div className={styles.contentWrap}>
					<LeagueFilterBar SearchInput={SearchInput} />
					<DynamicContentWrapper>
						<div className={styles.layout}>
							<div className={styles.loadingGrid}>
								{Array.from({ length: 8 }).map((_, i) => (
									<Skeleton key={i} className={styles.skeletonCard} />
								))}
							</div>
						</div>
					</DynamicContentWrapper>
				</div>
			</div>
		);
	}

	if (!directory || directory.length === 0) {
		return <NoContent type="info" description="No leagues in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<div className={styles.pageHeader}>
				<div className={styles.pageHeaderInner}>
					<h1 className={styles.pageTitle}>Competitions</h1>
					<span className={styles.leagueCount}>{directory.length} total</span>
				</div>
			</div>

			<div className={styles.contentWrap}>
				<LeagueFilterBar SearchInput={SearchInput} />
				<DynamicContentWrapper ref={wrapperRef}>
					<div className={styles.layout}>
						{hasResults ? (
							<>
								<div className={styles.grid}>
									{paginated.map((league) => (
										<LeagueCard key={league.id} league={league} />
									))}
								</div>
								<PaginationControls
									page={page}
									pageSize={pageSize}
									total={total}
									onPageChange={setPage}
									onPageSizeChange={setPageSize}
								/>
							</>
						) : (
							<div className={styles.noResults}>
								<NoContent type="info" description="No leagues match the current filters." />
							</div>
						)}
					</div>
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default LeaguesPage;
