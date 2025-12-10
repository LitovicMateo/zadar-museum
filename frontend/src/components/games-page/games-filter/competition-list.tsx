import React from 'react';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';

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
		<div className="flex flex-col sm:flex-row gap-2 overflow-y-auto sm:overflow-x-auto no-scrollbar pr-2 items-start sm:items-center max-h-48 w-full">
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
