// filter/boxscore-filter.tsx
import React from 'react';
import AppSelect from '@/components/forms/shared/AppSelect';

import { Skeleton } from '@/components/UI/Skeleton';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useSeasonTransition } from '@/hooks/UseSeasonTransition';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { usePlayerSeasons } from '@/hooks/queries/player/UsePlayerSeasons';

const BoxscoreFilter: React.FC = () => {
	const { season, setSeason, playerId, selectedDatabase } = useBoxscore();
	const { data: seasons, isLoading } = usePlayerSeasons(playerId, selectedDatabase);
	const { selectSeason, isPending } = useSeasonTransition(setSeason);

	const seasonOptions = React.useMemo(() => seasons?.map((s) => ({ value: s, label: s })) ?? [], [seasons]);
	const selectedSeason = seasonOptions.find((opt) => opt.value === season) ?? null;

	return (
		<div className="w-full max-w-[12rem]">
			<label className="mb-1 block font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
				Season
			</label>
			{isLoading ? (
				<Skeleton className="h-10 w-full rounded-lg" />
			) : (
				<div style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
					<AppSelect
						placeholder="Season"
						value={selectedSeason}
						options={seasonOptions}
						onChange={(opt) => selectSeason(String(opt?.value ?? ''))}
						styles={selectStyle()}
					/>
				</div>
			)}
		</div>
	);
};

export default BoxscoreFilter;
