import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';
import { ShieldHalf } from 'lucide-react';

type TeamNameProps = {
	name: string;
	imageUrl: string;
	slug: string;
};

const TeamName: React.FC<TeamNameProps> = ({ name, imageUrl, slug }) => {
	return (
		<div className="flex gap-4 h-full font-bold items-center">
			{!imageUrl.includes('undefined') ? (
				<div className="h-8 w-8 overflow-hidden">
					<img src={imageUrl} alt="" className="w-full h-full object-cover" />
				</div>
			) : (
				<ShieldHalf size={32} />
			)}
			<Link to={APP_ROUTES.team(slug)}>
				<h2 className="text-2xl whitespace-nowrap">{name}</h2>
			</Link>
		</div>
	);
};

export default TeamName;
