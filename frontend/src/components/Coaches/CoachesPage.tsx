import React, { useState } from 'react';

import CoachCard from '@/components/Coaches/CoachCard/CoachCard';
import CoachesFilterBar from '@/components/Coaches/CoachFilterBar/CoachesFilterBar';
import CoachesLeaders from '@/components/Coaches/CoachLeaders/CoachesLeaders';
import NoContent from '@/components/NoContent/NoContent';
import PaginationControls from '@/components/Pagination/PaginationControls';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/UI/DynamicContentWrapper';
import { Skeleton } from '@/components/UI/Skeleton';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useCoachesDirectory } from '@/hooks/queries/coach/useCoachDirectory';
import { useCoachAllTimeStats } from '@/hooks/queries/stats/UseCoachAllTimeStats';
import { RoleFilter, useCoachesFilters } from '@/hooks/useCoachesFilters';

import styles from '@/components/Coaches/CoachesPage.module.css';

const PAGE_SIZE = 12;

const CoachesPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);
	const [role, setRole] = useState<RoleFilter>('all');

	const { directory, isLoading } = useCoachesDirectory(role || 'all');
	const { data: headCoachStatsData } = useCoachAllTimeStats('main', 'head', 'all', 'all', 'all');
	const headCoachStats = headCoachStatsData?.current;
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search coaches...' });

	const { filtered, clearFilters, hasActiveFilters } = useCoachesFilters(directory, searchTerm, role, setRole);
	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filtered || [], undefined, {
		initialPageSize: PAGE_SIZE,
		resetDeps: [searchTerm, role]
	});

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, [page, role]);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<div className={styles.pageHeader}>
					<div className={styles.pageHeaderInner}>
						<h1 className={styles.pageTitle}>Coaches</h1>
					</div>
				</div>
				<div className={styles.contentWrap}>
					<CoachesFilterBar SearchInput={SearchInput} role={role} onRoleChange={setRole} />
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
			</div>
		);
	}

	if (!directory || directory.length === 0) {
		return <NoContent type="info" description="No coaches in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<div className={styles.pageHeader}>
				<div className={styles.pageHeaderInner}>
					<h1 className={styles.pageTitle}>Coaches</h1>
					<span className={styles.entityCount}>{directory.length} total</span>
				</div>
			</div>

			<DynamicContentWrapper ref={wrapperRef}>
				<div className={styles.contentWrap}>
					<CoachesFilterBar SearchInput={SearchInput} role={role} onRoleChange={setRole} />

					<div className={styles.layout}>
						<div className={styles.main}>
							{hasResults ? (
								<>
									<div className={styles.grid}>
										{paginated.map((coach) => (
											<CoachCard key={coach.id} coach={coach} />
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
									<NoContent type="info" description="No coaches match the current filters." />
									{hasActiveFilters && (
										<button type="button" onClick={clearFilters}>
											Clear filters
										</button>
									)}
								</div>
							)}
						</div>

						<CoachesLeaders stats={headCoachStats} />
					</div>
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default CoachesPage;
