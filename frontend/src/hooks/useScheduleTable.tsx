import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { TeamScheduleResponse } from '@/types/api/team';

export const ScheduleList: React.FC<{ schedule?: TeamScheduleResponse[] }> = ({ schedule = [] }) => {
	return (
		<div className="overflow-x-auto">
			<div className="w-full bg-white divide-y divide-gray-200">
				{schedule.map((g) => {
						const url = APP_ROUTES.game(g.game_document_id.toString());

						const home = g.home_score;
						const away = g.away_score;

						const homeName = g.home_team_name || '';
						const homeShort = g.home_team_short_name || '';
						const zadarIsHome = `${homeName} ${homeShort}`.toLowerCase().includes('zadar');

						let scoreCls = 'bg-gray-100 text-sm text-gray-800 px-2 py-1 rounded-lg text-center';
						if (typeof home === 'number' && typeof away === 'number') {
							if (home === away) {
								scoreCls = 'bg-yellow-100 text-yellow-700 text-sm px-2 py-1 rounded-lg text-center';
							} else {
								const homeWon = home > away;
								const zadarWon = (homeWon && zadarIsHome) || (!homeWon && !zadarIsHome);
								scoreCls = zadarWon
									? 'bg-green-100 text-green-700 text-sm px-2 py-1 rounded-lg text-center'
									: 'bg-red-100 text-red-700 text-sm px-2 py-1 rounded-lg text-center';
							}
						}

						const formattedDate = g.game_date
							? new Date(g.game_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })
							: '-';

						return (
							<div key={g.game_document_id} className="flex items-center py-2 px-1">
								{/* Round - fixed */}
								<div className="flex-none w-8 text-center text-sm text-gray-500 whitespace-nowrap">
									{g.round ?? '-'}
								</div>

								{/* Date - fixed */}
								<div className="flex-none w-20 text-xs text-gray-500 text-center whitespace-nowrap">
									{formattedDate}
								</div>

								{/* Teams - flexible */}
								<div className="flex-1 min-w-0 px-2">
									<Link to={url} className="flex items-center gap-2 text-sm text-gray-800 min-w-0">
										{/* Full names on sm+; short names on mobile to avoid truncation */}
										<span className="font-medium truncate min-w-0 hidden sm:inline">
											{g.home_team_name}
										</span>
										<span className="font-medium truncate min-w-0 sm:hidden">
											{g.home_team_short_name ?? g.home_team_name}
										</span>
										<span className="text-gray-400 shrink-0">vs</span>
										<span className="truncate min-w-0 hidden sm:inline">{g.away_team_name}</span>
										<span className="truncate min-w-0 sm:hidden">
											{g.away_team_short_name ?? g.away_team_name}
										</span>
									</Link>
								</div>

								{/* Score - fixed */}
								<div className="flex-none w-16 text-center">
									<div className={scoreCls}>
										{typeof home === 'number' || typeof away === 'number'
											? `${home ?? '-'} - ${away ?? '-'}`
											: '-'}
									</div>
								</div>
							</div>
						);
				})}
			</div>
		</div>
	);
};
