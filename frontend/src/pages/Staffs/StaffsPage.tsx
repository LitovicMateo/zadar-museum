import React from 'react';
import { Link } from 'react-router-dom';

import StaffCard from '@/components/Staffs/StaffCard/StaffCard';
import StaffFilterBar from '@/components/Staffs/StaffFilterBar/StaffFilterBar';
import NoContent from '@/components/no-content/NoContent';
import PaginationControls from '@/components/pagination/PaginationControls';
import DynamicContentWrapper, { DynamicContentWrapperHandle } from '@/components/ui/DynamicContentWrapper';
import { Skeleton } from '@/components/ui/Skeleton';
import { APP_ROUTES } from '@/constants/Routes';
import usePagedSortedList from '@/hooks/UsePagedSortedList';
import { useSearch } from '@/hooks/UseSearch';
import { useStaffs } from '@/hooks/queries/staff/UseStaffs';
import { StaffDetailsResponse } from '@/types/api/Staff';
import { searchPlayers } from '@/utils/SearchFunctions';

import styles from '@/pages/Staffs/StaffsPage.module.css';

const PAGE_SIZE = 12;

const StaffsPage: React.FC = () => {
	const wrapperRef = React.useRef<DynamicContentWrapperHandle>(null);

	const { data: staffs, isLoading } = useStaffs();
	const { searchTerm, SearchInput } = useSearch();

	console.log(staffs);

	const filteredStaff = searchPlayers(staffs as never[], searchTerm) as unknown as StaffDetailsResponse[];
	const { page, pageSize, paginated, setPage, setPageSize, total } = usePagedSortedList(filteredStaff, undefined, {
		initialPageSize: PAGE_SIZE,
		resetDeps: [searchTerm]
	});

	React.useEffect(() => {
		wrapperRef.current?.scrollToTop();
	}, [page, pageSize, searchTerm]);

	if (isLoading) {
		return (
			<div className={styles.page}>
				<StaffFilterBar SearchInput={SearchInput} />
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

	if (!staffs || staffs.length === 0) {
		return <NoContent type="info" description="No staff in database." />;
	}

	const hasResults = paginated && paginated.length > 0;

	return (
		<div className={styles.page}>
			<StaffFilterBar SearchInput={SearchInput} />
			<DynamicContentWrapper ref={wrapperRef}>
				<div className={styles.layout}>
					{hasResults ? (
						<>
							<div className={styles.grid}>
								{paginated.map((staff) => (
									<Link
										to={APP_ROUTES.staff(staff.documentId)}
										key={staff.id}
										className={styles.cardLink}
									>
										<StaffCard staff={staff} />
									</Link>
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
							<NoContent type="info" description="No staff match the current filters." />
						</div>
					)}
				</div>
			</DynamicContentWrapper>
		</div>
	);
};

export default StaffsPage;
