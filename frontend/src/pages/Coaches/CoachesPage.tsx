import React, { useState } from 'react';

import CoachCard from '@/components/Coaches/CoachCard/CoachCard';
import CoachesFilterBar from '@/components/Coaches/CoachFilterBar/CoachesFilterBar';
import CoachesLeaders from '@/components/Coaches/CoachLeaders/CoachesLeaders';
import NoContent from '@/components/no-content/NoContent';
import PaginationControls from '@/components/pagination/PaginationControls';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/ui/DynamicContentWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useCoachesDirectory } from '@/hooks/queries/coach/useCoachDirectory';
import { RoleFilter, useCoachesFilters } from '@/hooks/useCoachesFilters';

import styles from '@/pages/Coaches/CoachesPage.module.css';

const PAGE_SIZE = 12;

const CoachesPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);
	const [role, setRole] = useState<RoleFilter>('all');

	const { directory, allTimeStats, isLoading } = useCoachesDirectory(role || 'all');
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search coaches...' });

	const { filtered, clearFilters, hasActiveFilters } = useCoachesFilters(directory, searchTerm, role, setRole);
	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(filtered || [], undefined, {
		initialPageSize: PAGE_SIZE,

		resetDeps: [searchTerm]
	});

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, []);

	if (isLoading) {
		return (
			<div className={styles.page}>
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
		);
	}

	if (!directory || directory.length === 0) {
		return <NoContent type="info" description="No coaches in database." />;
	}

	console.log(filtered);
	console.log(paginated);

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<DynamicContentWrapper ref={wrapperRef}>
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

					<CoachesLeaders stats={allTimeStats} />
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default CoachesPage;
