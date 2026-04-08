import React from 'react';

import NoContent from '@/components/NoContent/NoContent';
import PaginationControls from '@/components/Pagination/PaginationControls';
import TeamCard from '@/components/Teams/TeamCard/TeamCard';
import TeamFilterBar from '@/components/Teams/TeamFilterBar/TeamFilterBar';
import TeamLeaders from '@/components/Teams/TeamLeaders/TeamLeaders';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/UI/DynamicContentWrapper';
import { Skeleton } from '@/components/UI/Skeleton';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useTeamsDirectory } from '@/hooks/queries/team/useTeamsDirectory';
import { useTeamsFilter } from '@/hooks/useTeamsFilter';

import styles from '@/components/Teams/TeamsPage.module.css';

const PAGE_SIZE = 12;

const TeamsPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);

	const { directory, isLoading } = useTeamsDirectory();
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search teams...' });

	const filteredTeams = useTeamsFilter(directory, searchTerm);
	const { paginated, total, page, pageSize, setPage, setPageSize } = usePagedSortedList(
		filteredTeams || [],
		undefined,
		{
			initialPageSize: PAGE_SIZE,
			resetDeps: [searchTerm]
		}
	);

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, [page, pageSize, searchTerm]);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<TeamFilterBar SearchInput={SearchInput} />
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
		return <NoContent type="info" description="No teams in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<TeamFilterBar SearchInput={SearchInput} />
			<DynamicContentWrapper ref={wrapperRef}>
				<div className={styles.layout}>
					<div className={styles.main}>
						{hasResults ? (
							<>
								<div className={styles.grid}>
									{paginated.map((team) => (
										<TeamCard key={team.id} team={team} />
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
								<NoContent type="info" description="No teams match the current filters." />
							</div>
						)}
					</div>

					<TeamLeaders stats={directory} />
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default TeamsPage;
