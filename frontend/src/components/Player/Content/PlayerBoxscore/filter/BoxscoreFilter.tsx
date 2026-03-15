// filter/boxscore-filter.tsx
import React from 'react';
import Select from 'react-select';

import { Skeleton } from '@/components/ui/Skeleton';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useSeasonTransition } from '@/hooks/UseSeasonTransition';
import { usePlayerSeasons } from '@/hooks/queries/player/UsePlayerSeasons';

import styles from './BoxscoreFilter.module.css';

const BoxscoreFilter: React.FC = () => {
	const { season, setSeason, playerId, selectedDatabase } = useBoxscore();
	const { data: seasons, isLoading } = usePlayerSeasons(playerId, selectedDatabase);
	const { selectSeason, isPending } = useSeasonTransition(setSeason);

	const seasonOptions = React.useMemo(
		() => seasons?.map((s) => ({ value: s, label: s })) ?? [],
		[seasons]
	);
	const selectedSeason = seasonOptions.find((opt) => opt.value === season) ?? null;

	if (isLoading) {
		return (
			<div className={styles.skeletonRow} aria-busy="true" aria-label="Loading filters">
				<Skeleton style={{ width: 140, height: 34, borderRadius: 6 }} />
			</div>
		);
	}

	return (
		<div className={styles.filter} style={{ opacity: isPending ? 0.6 : 1, transition: 'opacity 0.15s ease' }}>
			<Select
				placeholder="Season"
				className={styles.select}
				value={selectedSeason}
				options={seasonOptions}
				onChange={(opt) => selectSeason(String(opt?.value ?? ''))}
				styles={selectStyle()}
			/>
		</div>
	);
};

export default BoxscoreFilter;
