import React from 'react';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';

import styles from './CompetitionList.module.css';

interface Competition {
	league_id: string | number;
	league_name: string;
	league_short_name?: string;
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
					leagueShortName={competition.league_short_name}
					selectedCompetitions={selectedCompetitions}
					onCompetitionChange={toggleCompetition}
				/>
			))}
		</div>
	);
};

export default CompetitionList;
