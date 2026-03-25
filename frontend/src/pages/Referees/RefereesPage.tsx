import React from 'react';

import RefereeCard from '@/components/Referees/RefereeCard/RefereeCard';
import RefereeFilterBar from '@/components/Referees/RefereeFilterBar/RefereeFilterBar';
import RefereeLeaders from '@/components/Referees/RefereeLeaders/RefereeLeaders';
import NoContent from '@/components/no-content/NoContent';
import PaginationControls from '@/components/pagination/PaginationControls';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/ui/DynamicContentWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useRefereesDirectory } from '@/hooks/queries/referee/useRefereesDirectory';
import { RefereeDirectoryEntry } from '@/types/api/Referee';
import { searchReferees } from '@/utils/SearchFunctions';

import styles from '@/pages/Referees/RefereesPage.module.css';

const RefereesPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);

	const { directory, isLoading } = useRefereesDirectory();
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search referees...' });
	const filteredDirectory = searchReferees(directory as never[], searchTerm) as unknown as RefereeDirectoryEntry[];
	const { page, pageSize, paginated, setPage, setPageSize, total } = usePagedSortedList(
		filteredDirectory,
		undefined,
		{
			initialPageSize: 12,
			resetDeps: [searchTerm]
		}
	);

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, []);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<RefereeFilterBar SearchInput={SearchInput} />
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
		);
	}

	if (!directory || directory.length === 0) {
		return <NoContent type="info" description="No referees in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<RefereeFilterBar SearchInput={SearchInput} />
			<DynamicContentWrapper ref={wrapperRef}>
				<div className={styles.layout}>
					<div className={styles.main}>
						{hasResults ? (
							<>
								<div className={styles.grid}>
									{paginated.map((referee) => (
										<RefereeCard key={referee.id} referee={referee} />
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
								<NoContent type="info" description="No referees match the current filters." />
							</div>
						)}
					</div>

					<RefereeLeaders stats={directory} />
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default RefereesPage;
