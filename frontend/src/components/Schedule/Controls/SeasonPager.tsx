import React, { useMemo } from 'react';
import Select from 'react-select';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { OptionType, selectStyle } from '@/constants/ReactSelectStyle';
import { cn } from '@/lib/Utils';

type SeasonPagerProps = {
	/** Seasons sorted most-recent-first (index 0 = newest). */
	seasons: string[];
	selectedSeason: string;
	onSeasonChange: (season: string) => void;
	isPending?: boolean;
};

const SeasonPager: React.FC<SeasonPagerProps> = ({ seasons, selectedSeason, onSeasonChange, isPending }) => {
	const options: OptionType[] = useMemo(() => seasons.map((s) => ({ value: s, label: s })), [seasons]);
	const index = seasons.indexOf(selectedSeason);

	// seasons[0] is newest -> moving "older" increments the index, "newer" decrements it
	const olderDisabled = index < 0 || index >= seasons.length - 1;
	const newerDisabled = index <= 0;

	const arrowClass = (disabled: boolean) =>
		cn(
			'flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors',
			disabled ? 'cursor-not-allowed opacity-40' : 'hover:bg-accent hover:text-foreground'
		);

	return (
		<div
			className="flex items-center gap-2"
			style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}
		>
			<button
				type="button"
				aria-label="Older season"
				disabled={olderDisabled}
				onClick={() => !olderDisabled && onSeasonChange(seasons[index + 1])}
				className={arrowClass(olderDisabled)}
			>
				<ChevronLeft size={18} />
			</button>
			<Select<OptionType, false>
				value={options.find((o) => o.value === selectedSeason) ?? null}
				options={options}
				onChange={(opt) => opt && onSeasonChange(String(opt.value))}
				styles={selectStyle('140px')}
				isSearchable={false}
				placeholder="Season"
				menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
				menuPosition="fixed"
				menuPlacement="auto"
			/>
			<button
				type="button"
				aria-label="Newer season"
				disabled={newerDisabled}
				onClick={() => !newerDisabled && onSeasonChange(seasons[index - 1])}
				className={arrowClass(newerDisabled)}
			>
				<ChevronRight size={18} />
			</button>
		</div>
	);
};

export default SeasonPager;
