import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { ShieldHalf } from 'lucide-react';

type TeamNameProps = {
	name: string;
	imageUrl: string | undefined;
	slug: string;
};

const TeamName: React.FC<TeamNameProps> = ({ name, imageUrl, slug }) => {
	return (
		<Link to={APP_ROUTES.team(slug)} className="group flex items-center gap-3">
			<div className="flex size-9 items-center justify-center overflow-hidden rounded-md bg-white p-1 ring-1 ring-white/20">
				{imageUrl ? (
					<img src={imageUrl} alt="" className="h-full w-full object-contain" />
				) : (
					<ShieldHalf size={20} className="text-court" />
				)}
			</div>
			<h2 className="font-display text-lg font-bold text-court-foreground transition-colors group-hover:text-record sm:text-xl">
				{name}
			</h2>
		</Link>
	);
};

export default TeamName;
