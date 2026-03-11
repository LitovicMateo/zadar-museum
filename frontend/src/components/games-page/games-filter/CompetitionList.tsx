import React from 'react';

import CompetitionSelectItem from '@/components/games-page/games-filter/CompetitionSelect';
import styles from './CompetitionList.module.css';

interface Competition {
	league_id: string | number;
	league_name: string;
}

interface Props {
	competitions?: Competition[];
	selectedCompetitions: string[];
	toggleCompetition: (id: string) => void;
}

const CompetitionList: React.FC<Props> = ({ competitions, selectedCompetitions, toggleCompetition }) => {
	if (!competitions) return null;

	return (
		<div className={styles.list}>
			{competitions.map((competition) => (
				<CompetitionSelectItem
					key={String(competition.league_id)}
					leagueName={competition.league_name}
					leagueId={String(competition.league_id)}
					selectedCompetitions={selectedCompetitions}
					onCompetitionChange={toggleCompetition}
				/>
			))}
		</div>
	);
};

export default CompetitionList;
