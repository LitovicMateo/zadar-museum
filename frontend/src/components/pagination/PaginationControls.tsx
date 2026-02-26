import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';

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
			className={`flex flex-col gap-3 py-2 sm:flex-row sm:items-center sm:justify-between ${className}`}
		>
			{/* Left: count + per-page selector */}
			<div className="flex items-center gap-3 text-sm text-muted-foreground">
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

				<div className="flex items-center gap-1.5">
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
			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => onPageChange(Math.max(1, page - 1))}
					disabled={page <= 1}
					aria-label="Previous page"
				>
					<ChevronLeft className="size-4" />
					<span className="hidden sm:inline">Prev</span>
				</Button>

				<span className="flex items-center gap-1.5 text-sm text-muted-foreground select-none tabular-nums">
					<span>Page</span>
					<span className="inline-flex h-7 min-w-[1.75rem] items-center justify-center rounded border border-border bg-background px-1.5 font-medium text-foreground shadow-xs">
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
					<span className="hidden sm:inline">Next</span>
					<ChevronRight className="size-4" />
				</Button>
			</div>
		</div>
	);
};

export default PaginationControls;
