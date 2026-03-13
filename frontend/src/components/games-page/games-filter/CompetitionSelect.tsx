import React from 'react';

import styles from './CompetitionSelect.module.css';

type CompetitionSelectItemProps = {
	leagueId: string;
	leagueName: string;
	leagueShortName?: string;
	selectedCompetitions: string[];
	onCompetitionChange: (slug: string) => void;
};

const CompetitionSelectItem: React.FC<CompetitionSelectItemProps> = ({
	leagueName,
	leagueShortName,
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
				{leagueShortName ? (
					<>
						<span className={styles.fullName}>{leagueName}</span>
						<span className={styles.shortName}>{leagueShortName}</span>
					</>
				) : (
					<span className={styles.fullName}>{leagueName}</span>
				)}
			</label>
		</div>
	);
};

export default CompetitionSelectItem;
