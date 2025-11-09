// filter/boxscore-filter.tsx
import React from 'react';
import Select from 'react-select';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import { selectStyle } from '@/constants/react-select-style';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { usePlayerSeasons } from '@/hooks/queries/player/usePlayerSeasons';

const BoxscoreFilter: React.FC = () => {
	const { season, setSeason, selectedCompetitions, toggleCompetition, competitions, playerId, selectedDatabase } =
		useBoxscore();
	const { data: seasons, isLoading } = usePlayerSeasons(playerId, selectedDatabase);

	// --- Season Options ---
	const seasonOptions = seasons?.map((s) => ({ value: s, label: s })) ?? [];
	const selectedSeason = seasonOptions.find((opt) => opt.value === season) ?? null;

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="flex gap-4 w-full justify-between font-abel">
			<div className="flex gap-4">
				{competitions.map((c) => (
					<CompetitionSelectItem
						key={c.league_id}
						leagueId={c.league_id}
						leagueName={c.league_name}
						onCompetitionChange={toggleCompetition}
						selectedCompetitions={selectedCompetitions}
					/>
				))}
			</div>
			<Select
				placeholder="Season"
				className="text-sm shadow-sm w-full"
				value={selectedSeason}
				options={seasonOptions}
				onChange={(opt) => setSeason(opt?.value ?? '')}
				styles={selectStyle()}
			/>
		</div>
	);
};

export default BoxscoreFilter;
