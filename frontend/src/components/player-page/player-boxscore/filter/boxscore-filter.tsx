// filter/boxscore-filter.tsx
import React from 'react';
import Select from 'react-select';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import { Skeleton } from '@/components/ui/skeleton';
import { selectStyle } from '@/constants/react-select-style';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerSeasons } from '@/hooks/queries/player/usePlayerSeasons';

import styles from './boxscore-filter.module.css';

const BoxscoreFilter: React.FC = () => {
	const { season, setSeason, selectedCompetitions, toggleCompetition, competitions, playerId, selectedDatabase } =
		useBoxscore();
	const { data: seasons, isLoading } = usePlayerSeasons(playerId, selectedDatabase);

	// --- Season Options ---
	const seasonOptions = seasons?.map((s) => ({ value: s, label: s })) ?? [];
	const selectedSeason = seasonOptions.find((opt) => opt.value === season) ?? null;

	if (isLoading) {
		return (
			<div className={styles.skeletonRow} aria-busy="true" aria-label="Loading filters">
				<Skeleton style={{ width: 90, height: 34, borderRadius: 6 }} />
				<Skeleton style={{ width: 90, height: 34, borderRadius: 6 }} />
				<Skeleton style={{ width: 140, height: 34, borderRadius: 6 }} />
			</div>
		);
	}

	return (
		<div className={styles.filter}>
			<div className={styles.competitions}>
				{competitions.map((c) => (
					<CompetitionSelectItem
						key={String(c.league_id)}
						leagueId={String(c.league_id)}
						leagueName={c.league_name}
						onCompetitionChange={toggleCompetition}
						selectedCompetitions={selectedCompetitions}
					/>
				))}
			</div>
			<Select
				placeholder="Season"
				className={styles.select}
				value={selectedSeason}
				options={seasonOptions}
				onChange={(opt) => setSeason(String(opt?.value ?? ''))}
				styles={selectStyle()}
			/>
		</div>
	);
};

export default BoxscoreFilter;
