import React from 'react';

import CompetitionSelectItem from '@/components/games-page/games-filter/CompetitionSelect';
import Heading from '@/components/ui/Heading';
import { useBoxscore } from '@/hooks/context/UseBoxscore';

import Boxscore from './boxscore/Boxscore';
import BoxscoreFilter from './filter/BoxscoreFilter';
import SeasonAverage from './season-average/SeasonAverage';

import styles from './PlayerBoxscore.module.css';

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
							leagueShortName={c.league_short_name}
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
