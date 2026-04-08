import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { useGameDetails } from '@/hooks/queries/game/UseGameDetails';
import { useGameScore } from '@/hooks/queries/game/UseGameScore';
import { getImageUrl } from '@/utils/GetImageUrl';
import { Shield } from 'lucide-react';

import GameInfo from './GameInfo';
import styles from './GameHeader.module.css';

const GameHeader: React.FC = () => {
	const { gameId } = useParams();

	// fetch game details
	const { data: game, isLoading } = useGameDetails(gameId!);

	const { data: score } = useGameScore(gameId!);

	if (!game || isLoading) return null;

	const homeImagePath = game.home_team?.image?.url;
	const awayImagePath = game.away_team?.image?.url;

	const homeImageUrl = homeImagePath ? getImageUrl(homeImagePath) : '';
	const awayImageUrl = awayImagePath ? getImageUrl(awayImagePath) : '';

	return (
		<section className={styles.section}>
			<div className={styles.inner}>
				{/* Main Score Card */}
				<div className={styles.card}>
					{/* Dynamic sporty pattern overlay - diagonal stripes */}
					<div
						className={styles.pattern}
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066ff' fill-opacity='1'%3E%3Cpath d='M0 80L80 0h-4L0 76zm0-8L72 0h-4L0 68zm0-8L64 0h-4L0 60zm0-8L56 0h-4L0 52zm0-8L48 0h-4L0 44zm0-8L40 0h-4L0 36zm0-8L32 0h-4L0 28zm0-8L24 0h-4L0 20zm0-8L16 0h-4L0 12zm0-8L8 0H4L0 4zM80 80V76l-76 4h76zm0-8V68l-68 4h68zm0-8V60l-60 4h60zm0-8V52l-52 4h52zm0-8V44l-44 4h44zm0-8V36l-36 4h36zm0-8V28l-28 4h28zm0-8V20l-20 4h20zm0-8V12l-12 4h12zm0-8V4l-4 4h4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
						}}
					></div>

					{/* Teams and Score */}
					<div className={styles.grid}>
						{/* Home Team */}
						<Link
							to={APP_ROUTES.team(game.home_team.slug)}
							className={styles.teamLink}
						>
							<div className={styles.logoBox}>
								{homeImageUrl && !homeImageUrl.includes('undefined') ? (
									<img
										src={homeImageUrl}
										alt={game.home_team_name}
										className={styles.logoImg}
									/>
								) : (
									<Shield size={40} className="text-blue-600" strokeWidth={1.5} />
								)}
							</div>
							<div className={styles.teamNameCenter}>
								<p className={styles.teamNameSm}>
									{game.home_team_short_name}
								</p>
								<p className={styles.teamNameLg}>
									{game.home_team_name}
								</p>
							</div>
						</Link>

						{/* Score */}
						<div className={styles.scoreCol}>
							<div className={styles.scoreBox}>
								<div className={styles.scoreNums}>
									<span className={styles.scoreNum}>{score?.home_score ?? '-'}</span>
									<span className={styles.scoreSep}>:</span>
									<span className={styles.scoreNum}>{score?.away_score ?? '-'}</span>
								</div>
							</div>
							{game.forfeited && (
								<span className={styles.tagForfeited}>
									FORFEITED
								</span>
							)}
							{game.isNulled && (
								<span className={styles.tagNulled}>
									NULLED
								</span>
							)}
						</div>

						{/* Away Team */}
						<Link
							to={APP_ROUTES.team(game.away_team.slug)}
							className={styles.teamLink}
						>
							<div className={styles.logoBox}>
								{awayImageUrl && !awayImageUrl.includes('undefined') ? (
									<img
										src={awayImageUrl}
										alt={game.away_team_name}
										className={styles.logoImg}
									/>
								) : (
									<Shield size={40} className="text-blue-600" strokeWidth={1.5} />
								)}
							</div>
							<div className={styles.teamNameCenter}>
								<p className={styles.teamNameSm}>
									{game.away_team_short_name}
								</p>
								<p className={styles.teamNameLg}>
									{game.away_team_name}
								</p>
							</div>
						</Link>
					</div>

					{/* Game Info */}
					<div className={styles.infoWrap}>
						<GameInfo />
					</div>
				</div>
			</div>
		</section>
	);
};

export default GameHeader;
