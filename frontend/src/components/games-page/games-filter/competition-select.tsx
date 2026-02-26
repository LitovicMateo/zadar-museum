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
			<label className="flex gap-2 items-center cursor-pointer group hover:bg-gray-50 px-2 py-1 rounded-md transition-colors">
				<input
					type="checkbox"
					value={leagueId}
					checked={checked}
					onChange={() => onCompetitionChange(leagueId)}
					className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all cursor-pointer"
				/>
				<span className="text-sm truncate w-fit text-gray-700 group-hover:text-gray-900 transition-colors">
					{leagueName}
				</span>
			</label>
		</div>
	);
};

export default CompetitionSelectItem;
