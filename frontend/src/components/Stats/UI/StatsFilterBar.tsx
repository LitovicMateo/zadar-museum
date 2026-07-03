import React from 'react';
import { Search } from 'lucide-react';

import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';

type StatsFilterBarProps = {
	/** Control rendered first in the bar and always visible (e.g. an entity-type toggle). */
	leading?: React.ReactNode;
	/** The element returned by `useSearch().SearchInput`. Omit on pages without search. */
	searchInput?: React.ReactNode;
	/** Title shown at the top of the mobile filter sheet. */
	sheetTitle?: string;
	/** Filter controls. Rendered inline on desktop, inside the bottom sheet on mobile. */
	children: React.ReactNode;
};

/**
 * Shared filter bar for the /stats pages. The `leading` slot and search sit
 * inline; all other controls are wrapped in {@link MobileFilterSheet} so they
 * render inline on desktop and collapse behind the floating "Filters" button on
 * mobile.
 */
const StatsFilterBar: React.FC<StatsFilterBarProps> = ({ leading, searchInput, sheetTitle = 'Filters', children }) => {
	return (
		<div className="sticky top-0 z-10 mb-3 flex flex-wrap items-end gap-3 bg-chalk py-2">
			{leading}
			{searchInput && (
				<div className="relative flex min-w-[200px] max-w-[280px] flex-1 items-center [&_input]:pl-7">
					<Search size={13} className="pointer-events-none absolute left-2 z-[1] text-muted-foreground" aria-hidden />
					{searchInput}
				</div>
			)}
			<MobileFilterSheet title={sheetTitle}>{children}</MobileFilterSheet>
		</div>
	);
};

export default StatsFilterBar;
