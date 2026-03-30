import React from 'react';

import NoContent from '@/components/NoContent/NoContent';
import PaginationControls from '@/components/Pagination/PaginationControls';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/UI/DynamicContentWrapper';
import { Skeleton } from '@/components/UI/Skeleton';
import VenueCard from '@/components/Venues/VenueCard/VenueCard';
import VenueFilterBar from '@/components/Venues/VenueFilterBar/VenueFilterBar';
import VenueLeaders from '@/components/Venues/VenueLeaders/VenueLeaders';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useVenuesDirectory } from '@/hooks/queries/venue/useVenuesDirectory';
import { VenueDirectoryEntry } from '@/types/api/Venue';
import { searchVenues } from '@/utils/SearchFunctions';

import styles from '@/components/Venues/VenuesPage.module.css';

const PAGE_SIZE = 12;

const VenuesPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);

	const { directory, isLoading } = useVenuesDirectory();
	const { SearchInput, searchTerm } = useSearch({ placeholder: 'Search venues...' });

	const filteredVenues = searchVenues(directory as never[], searchTerm) as unknown as VenueDirectoryEntry[];
	const { paginated, page, pageSize, total, setPage, setPageSize } = usePagedSortedList(filteredVenues, undefined, {
		initialPageSize: PAGE_SIZE,
		resetDeps: [searchTerm]
	});

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, [page]);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<VenueFilterBar SearchInput={SearchInput} />
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
		return <NoContent type="info" description="No venues in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<VenueFilterBar SearchInput={SearchInput} />
			<DynamicContentWrapper ref={wrapperRef}>
				<div className={styles.layout}>
					<div className={styles.main}>
						{hasResults ? (
							<>
								<div className={styles.grid}>
									{paginated.map((venue) => (
										<VenueCard key={venue.id} venue={venue} />
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
								<NoContent type="info" description="No venues match the current filters." />
							</div>
						)}
					</div>

					<VenueLeaders stats={directory} />
				</div>
			</DynamicContentWrapper>
		</div>
	);

	return <div></div>;
};

export default VenuesPage;
