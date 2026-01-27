import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useGameDetails } from '@/hooks/queries/game/useGameDetails';
import { useGameScore } from '@/hooks/queries/game/useGameScore';
import { getImageUrl } from '@/utils/getImageUrl';
import { Shield } from 'lucide-react';

import GameInfo from './game-info';

const GameHeader: React.FC = () => {
	const { gameId } = useParams();

	// fetch game details
	const { data: game, isLoading } = useGameDetails(gameId!);

	console.log(game);

	const { data: score } = useGameScore(gameId!);

	if (!game || isLoading) return null;

	const homeImagePath = game.home_team?.image?.url;
	const awayImagePath = game.away_team?.image?.url;
	console.log(awayImagePath);

	const homeImageUrl = homeImagePath ? getImageUrl(homeImagePath) : '';
	const awayImageUrl = awayImagePath ? getImageUrl(awayImagePath) : '';

	console.log(awayImageUrl);

	return (
		<section className="w-full px-4">
			<div className="max-w-[1000px] mx-auto">
				{/* Main Score Card */}
				<div className="bg-gradient-to-br from-white via-blue-50/30 to-slate-50 rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden relative">
					{/* Dynamic sporty pattern overlay - diagonal stripes */}
					<div
						className="absolute inset-0 opacity-[0.04]"
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230066ff' fill-opacity='1'%3E%3Cpath d='M0 80L80 0h-4L0 76zm0-8L72 0h-4L0 68zm0-8L64 0h-4L0 60zm0-8L56 0h-4L0 52zm0-8L48 0h-4L0 44zm0-8L40 0h-4L0 36zm0-8L32 0h-4L0 28zm0-8L24 0h-4L0 20zm0-8L16 0h-4L0 12zm0-8L8 0H4L0 4zM80 80V76l-76 4h76zm0-8V68l-68 4h68zm0-8V60l-60 4h60zm0-8V52l-52 4h52zm0-8V44l-44 4h44zm0-8V36l-36 4h36zm0-8V28l-28 4h28zm0-8V20l-20 4h20zm0-8V12l-12 4h12zm0-8V4l-4 4h4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
						}}
					></div>

					{/* Teams and Score */}
					<div className="grid grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 p-6 md:p-8 items-center relative z-10">
						{/* Home Team */}
						<Link
							to={APP_ROUTES.team(game.home_team.slug)}
							className="flex flex-col items-center gap-3 group hover:scale-105 transition-transform duration-200"
						>
							<div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-200">
								{homeImageUrl && !homeImageUrl.includes('undefined') ? (
									<img
										src={homeImageUrl}
										alt={game.home_team_name}
										className="w-full h-full object-contain p-2"
									/>
								) : (
									<Shield size={40} className="text-blue-600" strokeWidth={1.5} />
								)}
							</div>
							<div className="text-center">
								<p className="md:hidden font-bold text-lg group-hover:text-blue-600 transition-colors duration-200">
									{game.home_team_short_name}
								</p>
								<p className="hidden md:block font-bold text-xl group-hover:text-blue-600 transition-colors duration-200">
									{game.home_team_name}
								</p>
							</div>
						</Link>

						{/* Score */}
						<div className="flex flex-col items-center gap-2">
							<div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-6 py-4 md:px-8 md:py-6 rounded-xl shadow-lg">
								<div className="flex items-center gap-2 md:gap-4 text-3xl md:text-5xl font-bold font-mono">
									<span className="min-w-[2ch] text-center">{score?.home_score ?? '-'}</span>
									<span className="text-blue-200">:</span>
									<span className="min-w-[2ch] text-center">{score?.away_score ?? '-'}</span>
								</div>
							</div>
							{game.forfeited && (
								<span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
									FORFEITED
								</span>
							)}
							{game.isNulled && (
								<span className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-300">
									NULLED
								</span>
							)}
						</div>

						{/* Away Team */}
						<Link
							to={APP_ROUTES.team(game.away_team.slug)}
							className="flex flex-col items-center gap-3 group hover:scale-105 transition-transform duration-200"
						>
							<div className="w-16 h-16 md:w-24 md:h-24 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-200">
								{awayImageUrl && !awayImageUrl.includes('undefined') ? (
									<img
										src={awayImageUrl}
										alt={game.away_team_name}
										className="w-full h-full object-contain p-2"
									/>
								) : (
									<Shield size={40} className="text-blue-600" strokeWidth={1.5} />
								)}
							</div>
							<div className="text-center">
								<p className="md:hidden font-bold text-lg group-hover:text-blue-600 transition-colors duration-200">
									{game.away_team_short_name}
								</p>
								<p className="hidden md:block font-bold text-xl group-hover:text-blue-600 transition-colors duration-200">
									{game.away_team_name}
								</p>
							</div>
						</Link>
					</div>

					{/* Game Info */}
					<div className="border-t-2 border-gray-100">
						<GameInfo />
					</div>
				</div>
			</div>
		</section>
	);
};

export default GameHeader;
