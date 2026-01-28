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
		<Link to={APP_ROUTES.team(slug)} className="flex gap-3 h-full font-bold items-center group">
			<div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors duration-200 shadow-sm">
				{!imageUrl.includes('undefined') ? (
					<img src={imageUrl} alt="" className="w-full h-full object-contain p-1" />
				) : (
					<ShieldHalf size={24} className="text-blue-600" />
				)}
			</div>
			<h2 className="text-xl md:text-2xl whitespace-nowrap group-hover:text-blue-600 transition-colors duration-200">
				{name}
			</h2>
		</Link>
	);
};

export default TeamName;
