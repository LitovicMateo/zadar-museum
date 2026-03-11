import React from 'react';
import styles from './CompetitionSelect.module.css';

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
		<div className={styles.item}>
			<label className={styles.label}>
				<input
					type="checkbox"
					value={leagueId}
					checked={checked}
					onChange={() => onCompetitionChange(leagueId)}
					className={styles.input}
				/>
				<span className={styles.text}>
					{leagueName}
				</span>
			</label>
		</div>
	);
};

export default CompetitionSelectItem;
