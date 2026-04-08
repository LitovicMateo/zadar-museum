import React, { useMemo } from 'react';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';
import Boxscore from '@/components/Player/Content/PlayerBoxscore/boxscore/Boxscore';
import BoxscoreFilter from '@/components/Player/Content/PlayerBoxscore/filter/BoxscoreFilter';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { useBoxscore } from '@/hooks/context/UseBoxscore';

import styles from './PlayerGamelog.module.css';

const PlayerGamelog: React.FC = () => {
	const { competitions, selectedCompetitions, toggleCompetition } = useBoxscore();

	const uniqueCompetitions = useMemo(() => {
		const seen = new Set<string>();
		return competitions.filter((c) => {
			if (seen.has(c.league_id)) return false;
			seen.add(c.league_id);
			return true;
		});
	}, [competitions]);

	return (
		<div className={styles.gamelog}>
			<div className={styles.gamelogControls}>
				<div className={styles.gamelogSeasonSelect}>
					<BoxscoreFilter />
				</div>
				{uniqueCompetitions.length > 1 && (
					<div className={styles.competitionList}>
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
			</div>
			<div className={styles.gamelogCard}>
				<DynamicContentWrapper>
					<Boxscore />
				</DynamicContentWrapper>
			</div>
		</div>
	);
};

export default PlayerGamelog;
