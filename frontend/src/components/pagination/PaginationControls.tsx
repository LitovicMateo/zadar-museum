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
		<div className={`flex items-center justify-between py-2 gap-4 flex-wrap ${className}`}>
			<div className="flex items-center gap-4">
				<div>
					{total > 0 ? (
						<span>
							Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
						</span>
					) : (
						<span>No items to show</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<label className="text-sm">Per page:</label>
					<select
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
				<button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1} className="btn">
					Prev
				</button>

				<div className="flex items-center gap-2">
					<label className="text-sm">Page</label>
					<input
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
						className="input w-20 text-center"
					/>
					<span className="text-sm">/ {totalPages}</span>
				</div>

				<button
					onClick={() => onPageChange(Math.min(totalPages, page + 1))}
					disabled={page >= totalPages}
					className="btn"
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default PaginationControls;
