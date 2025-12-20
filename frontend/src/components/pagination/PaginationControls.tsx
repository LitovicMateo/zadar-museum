import React from 'react';

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
			role="navigation"
			aria-label="Pagination"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === 'ArrowLeft') {
					if (page > 1) onPageChange(page - 1);
				}
				if (e.key === 'ArrowRight') {
					if (page < totalPages) onPageChange(page + 1);
				}
			}}
			className={`flex items-center justify-between py-2 gap-4 flex-wrap ${className}`}
		>
			<div className="flex items-center gap-4">
				<div>
					{total > 0 ? (
						<span aria-live="polite">
							Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
						</span>
					) : (
						<span>No items to show</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<label htmlFor="pagination-page-size" className="text-sm">
						Per page:
					</label>
					<select
						id="pagination-page-size"
						aria-label="Items per page"
						value={pageSize}
						onChange={(e) => {
							const v = Number(e.target.value) || pageSizeOptions[0];
							onPageSizeChange(v);
							onPageChange(1);
						}}
						className="input"
					>
						{pageSizeOptions.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button
					onClick={() => onPageChange(Math.max(1, page - 1))}
					disabled={page <= 1}
					className="btn"
					aria-label="Previous page"
				>
					Prev
				</button>

				<div className="flex items-center gap-2">
					<label htmlFor="pagination-page-input" className="text-sm">
						Page
					</label>
					<input
						id="pagination-page-input"
						type="number"
						min={1}
						max={totalPages}
						value={page}
						onChange={(e) => {
							let v = Number(e.target.value) || 1;
							if (v < 1) v = 1;
							if (v > totalPages) v = totalPages;
							onPageChange(v);
						}}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								const v = Number((e.target as HTMLInputElement).value) || 1;
								onPageChange(Math.min(Math.max(1, v), totalPages));
							}
						}}
						aria-label="Page number"
						className="input w-20 text-center"
					/>
					<span className="text-sm">/ {totalPages}</span>
				</div>

				<button
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
					disabled={page >= totalPages}
					className="btn"
					aria-label="Next page"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default PaginationControls;
