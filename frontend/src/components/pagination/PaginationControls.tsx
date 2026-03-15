import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/Select';
import styles from '@/components/pagination/PaginationControls.module.css';

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
		<div
			className={`${styles.wrapper} ${className}`}
		>
			{/* Left: count + per-page selector */}
			<div className={styles.left}>
				{total > 0 ? (
					<span>
						Showing{' '}
						<span className="font-medium text-foreground">
							{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)}
						</span>{' '}
						of <span className="font-medium text-foreground">{total}</span>
					</span>
				) : (
					<span>No items to show</span>
				)}

				<div className={styles.perPage}>
					<span className="text-muted-foreground">Per page:</span>
					<Select
						value={String(pageSize)}
						onValueChange={(v) => {
							onPageSizeChange(Number(v) || pageSizeOptions[0]);
							onPageChange(1);
						}}
					>
						<SelectTrigger size="sm" className="w-[70px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((opt) => (
								<SelectItem key={opt} value={String(opt)}>
									{opt}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Right: prev / page input / total / next */}
			<div className={styles.right}>
				<Button
					variant="outline"
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
					<span className={styles.pageNum}>
						{page}
					</span>
					<span>/ {totalPages}</span>
				</span>

				<Button
					variant="outline"
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
