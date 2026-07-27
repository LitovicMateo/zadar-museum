import React from 'react';

import Button from '@/components/UI/Button';
import AppSelect from '@/components/forms/shared/AppSelect';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import styles from '@/components/Pagination/PaginationControls.module.css';

type Props = {
	total: number;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
	pageSizeOptions?: number[];
	className?: string;
};

const PaginationControls: React.FC<Props> = ({
	total,
	page,
	pageSize,
	onPageChange,
	onPageSizeChange,
	pageSizeOptions = [5, 10, 20, 50],
	className = ''
}) => {
	const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

	return (
		<div className={`${styles.wrapper} ${className}`}>
			{/* Left: per-page selector */}
			<div className={styles.left}>
				<div className={styles.perPage}>
					<span className="text-muted-foreground">Per page:</span>
					<AppSelect
						options={pageSizeOptions.map((opt) => ({ value: opt, label: String(opt) }))}
						value={{ value: pageSize, label: String(pageSize) }}
						onChange={(opt) => {
							onPageSizeChange(Number(opt?.value) || pageSizeOptions[0]);
							onPageChange(1);
						}}
						styles={selectStyle('76px')}
						isSearchable={false}
						aria-label="Items per page"
					/>
				</div>
			</div>

			{/* Right: prev / page input / total / next */}
			<div className={styles.right}>
				<Button
					variant="brand"
					size="sm"
					onClick={() => onPageChange(Math.max(1, page - 1))}
					disabled={page <= 1}
					aria-label="Previous page"
				>
					<ChevronLeft className="size-4" />
					<span className={styles.hiddenMobile}>Prev</span>
				</Button>

				<span className={styles.pageInfo}>
					<span>Page</span>
					<span className={styles.pageNum}>{page}</span>
					<span>/ {totalPages}</span>
				</span>

				<Button
					variant="brand"
					size="sm"
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
					disabled={page >= totalPages}
					aria-label="Next page"
				>
					<span className={styles.hiddenMobile}>Next</span>
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default PaginationControls;
