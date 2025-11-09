import React from 'react';

type CompetitionSelectItemProps = {
	leagueId: string;
	leagueName: string;
	selectedCompetitions: string[];
	onCompetitionChange: (slug: string) => void;
};

const CompetitionSelectItem: React.FC<CompetitionSelectItemProps> = ({
	leagueName,
	leagueId,
	selectedCompetitions,
	onCompetitionChange
}) => {
	const checked = selectedCompetitions.includes(leagueId);

	return (
		<div className="flex gap-2">
			<label className="flex gap-2 items-center">
				<input
					type="checkbox"
					value={leagueId}
					checked={checked}
					onChange={() => onCompetitionChange(leagueId)}
				/>
				<span className="text-sm truncate w-fit">{leagueName}</span>
			</label>
		</div>
	);
};

export default CompetitionSelectItem;
