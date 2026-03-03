// filter/boxscore-filter.tsx
import React from 'react';
import Select from 'react-select';

import { Skeleton } from '@/components/ui/skeleton';
import { selectStyle } from '@/constants/react-select-style';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useSeasonTransition } from '@/hooks/useSeasonTransition';
import { usePlayerSeasons } from '@/hooks/queries/player/usePlayerSeasons';

import styles from './boxscore-filter.module.css';

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
