import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { TeamScheduleResponse } from '@/types/api/Team';

import styles from './ScheduleList.module.css';

// ── Sub-components ────────────────────────────────────────────

const RoundCell: React.FC<{ round: TeamScheduleResponse['round'] }> = ({ round }) => (
	<div className={styles.roundCell}>{round ?? '-'}</div>
);

const DateCell: React.FC<{ gameDate: TeamScheduleResponse['game_date'] }> = ({ gameDate }) => {
	const formatted = gameDate
		? new Date(gameDate).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
		: '-';
	return <div className={styles.dateCell}>{formatted}</div>;
};

type TeamsCellProps = {
	url: string;
	homeTeamName?: string | null;
	homeTeamShortName?: string | null;
	awayTeamName?: string | null;
	awayTeamShortName?: string | null;
};

const TeamsCell: React.FC<TeamsCellProps> = ({
	url,
	homeTeamName,
	homeTeamShortName,
	awayTeamName,
	awayTeamShortName
}) => (
	<div className={styles.teamsCell}>
		<Link to={url} className={styles.teamsLink}>
			<span className={`${styles.teamName} ${styles.teamNameFull}`}>{homeTeamName}</span>
			<span className={`${styles.teamName} ${styles.teamNameShort}`}>{homeTeamShortName ?? homeTeamName}</span>
			<span className={styles.vs}>vs</span>
			<span className={`${styles.teamName} ${styles.teamNameFull}`}>{awayTeamName}</span>
			<span className={`${styles.teamName} ${styles.teamNameShort}`}>{awayTeamShortName ?? awayTeamName}</span>
		</Link>
	</div>
);

type ScoreCellProps = {
	home?: number | null;
	away?: number | null;
	zadarIsHome: boolean;
};

const ScoreCell: React.FC<ScoreCellProps> = ({ home, away, zadarIsHome }) => {
	let modifier = styles.neutral;

	if (typeof home === 'number' && typeof away === 'number') {
		if (home === away) {
			modifier = styles.draw;
		} else {
			const homeWon = home > away;
			const zadarWon = (homeWon && zadarIsHome) || (!homeWon && !zadarIsHome);
			modifier = zadarWon ? styles.win : styles.loss;
		}
	}

	const label = typeof home === 'number' || typeof away === 'number' ? `${home ?? '-'} - ${away ?? '-'}` : '-';

	return (
		<div className={styles.scoreCell}>
			<div className={`${styles.scoreBadge} ${modifier}`}>{label}</div>
		</div>
	);
};

// ── ScheduleList ──────────────────────────────────────────────

export const ScheduleList: React.FC<{ schedule?: TeamScheduleResponse[] }> = ({ schedule = [] }) => (
	<div className={styles.wrapper}>
		<div className={styles.list}>
			{schedule.map((g) => {
				const url = APP_ROUTES.game(g.game_document_id.toString());

				const homeName = g.home_team_name ?? '';
				const homeShort = g.home_team_short_name ?? '';
				const zadarIsHome = `${homeName} ${homeShort}`.toLowerCase().includes('zadar');

				return (
					<div key={g.game_document_id} className={styles.row}>
						<RoundCell round={g.round} />
						<DateCell gameDate={g.game_date} />
						<TeamsCell
							url={url}
							homeTeamName={g.home_team_name}
							homeTeamShortName={g.home_team_short_name}
							awayTeamName={g.away_team_name}
							awayTeamShortName={g.away_team_short_name}
						/>
						<ScoreCell home={g.home_score} away={g.away_score} zadarIsHome={zadarIsHome} />
					</div>
				);
			})}
		</div>
	</div>
);
