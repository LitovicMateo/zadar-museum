import React from 'react';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import Heading from '@/components/ui/heading';
import { useBoxscore } from '@/hooks/context/useBoxscore';

import Boxscore from './boxscore/boxscore';
import BoxscoreFilter from './filter/boxscore-filter';
import SeasonAverage from './season-average/season-average';
import styles from './player-boxscore.module.css';

const PlayerBoxscore: React.FC = () => {
	const { competitions, selectedCompetitions, toggleCompetition } = useBoxscore();

	const uniqueCompetitions = React.useMemo(() => {
		const seen = new Set<string>();
		return competitions.filter((c) => {
			if (seen.has(c.league_id)) return false;
			seen.add(c.league_id);
			return true;
		});
	}, [competitions]);

	return (
		<section className={styles.section}>
			<BoxscoreFilter />
			<Heading title="Season Stats" type="secondary" />
			<SeasonAverage />
			<Heading title="Gamelog" type="secondary" />
			{uniqueCompetitions.length > 1 && (
				<div className={styles.competitions}>
					{uniqueCompetitions.map((c) => (
						<CompetitionSelectItem
							key={String(c.league_id)}
							leagueId={String(c.league_id)}
							leagueName={c.league_name}
							onCompetitionChange={toggleCompetition}
							selectedCompetitions={selectedCompetitions}
						/>
					))}
				</div>
			)}
			<Boxscore />
		</section>
	);
};

export default PlayerBoxscore;
