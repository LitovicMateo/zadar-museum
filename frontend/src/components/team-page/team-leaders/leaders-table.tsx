import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { TeamLeaders } from '@/hooks/queries/team/useTeamLeaders';

type LeadersTableProps = {
	teamLeaders: TeamLeaders[];
	selected: 'player' | 'coach';
	stat: string | null;
};

const LeadersTable: React.FC<LeadersTableProps> = ({ teamLeaders, selected, stat }) => {
	return (
		<div className="font-abel">
			<ul>
				<li className="flex justify-between border-b-1 border-solid border-gray-500 px-2 py-2 font-semibold bg-slate-100">
					<span>Player Name</span>
					<span>Statistic</span>
				</li>
				{teamLeaders?.map((leader, index) => {
					if (stat === null || leader[stat] === null || leader[stat] === '0') return null;

					const url = selected === 'player' ? APP_ROUTES.player(leader.id) : APP_ROUTES.coach(leader.id);
					return (
						<li
							className={`flex justify-between  px-2 py-2 ${index === teamLeaders.length - 1 ? '' : 'border-b-1 border-solid border-gray-500'}`}
						>
							<Link to={url}>
								{leader.first_name} {leader.last_name}
							</Link>
							<span className="px-2">{leader[stat]}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
};

export default LeadersTable;
