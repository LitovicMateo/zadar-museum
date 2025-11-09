import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { useTeamDetails } from '@/hooks/queries/team/useTeamDetails';
import { Stat } from '@/types/api/player';

type CareerHighRowProps = {
	label: string;
	stat: Stat;
	isLastItem: boolean;
};

const CareerHighRow: React.FC<CareerHighRowProps> = ({ label, stat, isLastItem }) => {
	const { data: team } = useTeamDetails(stat.opponent_team_slug!);

	return (
		<li
			className={`flex justify-between px-2 py-2 hover:bg-gray-50 ${isLastItem ? '' : 'border-b-1 border-solid border-gray-500'} `}
		>
			<Link to={APP_ROUTES.game(stat.game_id)} className=" hover:!text-black flex justify-between w-full text-lg">
				<div>{label}</div>
				<div className="flex gap-2 items-baseline">
					<span className="text-xl font-bold">{stat.stat_value}</span>
					<span className="text-sm">
						vs {team?.short_name} ({stat.game_date})
					</span>
				</div>
			</Link>
		</li>
	);
};

export default CareerHighRow;
