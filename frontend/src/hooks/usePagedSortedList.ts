import { useEffect, useMemo, useState } from 'react';

import { SortingState } from '@tanstack/react-table';

type Options = {
	initialPage?: number;
	initialPageSize?: number;
	resetDeps?: unknown[];
};

export default function usePagedSortedList<T = unknown>(
	items: T[] | undefined | null,
	sorting?: SortingState,
	options: Options = {}
) {
	const { initialPage = 1, initialPageSize = 10, resetDeps = [] } = options;

	const [page, setPage] = useState<number>(initialPage);
	const [pageSize, setPageSize] = useState<number>(initialPageSize);

	// stringify resetDeps to avoid spread in dependency array
	const resetKey = JSON.stringify(resetDeps);
	useEffect(() => setPage(initialPage), [initialPage, resetKey]);

	const sorted = useMemo(() => {
		if (!items) return undefined;
		if (!sorting || sorting.length === 0) return [...items];
		const sort = sorting[0];
		const id = String(sort.id);
		const desc = !!sort.desc;
		return [...items].sort((a, b) => {
			const va = (a as Record<string, unknown>)[id];
			const vb = (b as Record<string, unknown>)[id];
			if (va == null && vb == null) return 0;
			if (va == null) return 1;
			if (vb == null) return -1;
			const na = Number(String(va));
			const nb = Number(String(vb));
			if (!Number.isNaN(na) && !Number.isNaN(nb)) return desc ? nb - na : na - nb;
			return desc ? String(vb).localeCompare(String(va)) : String(va).localeCompare(String(vb));
		});
	}, [items, sorting]);

	const total = sorted?.length ?? 0;
	const totalPages = total === 0 ? 1 : Math.max(1, Math.ceil(total / pageSize));

	useEffect(() => {
		if (page > totalPages) setPage(totalPages);
	}, [page, pageSize, totalPages]);

	const paginated = sorted ? sorted.slice((page - 1) * pageSize, page * pageSize) : undefined;

	return {
		sorted,
		paginated,
		total,
		page,
		pageSize,
		totalPages,
		setPage,
		setPageSize
	} as const;
}
