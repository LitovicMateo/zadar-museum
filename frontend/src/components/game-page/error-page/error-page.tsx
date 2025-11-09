import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/routes';

const GameErrorPage: React.FC = () => {
	return (
		<div className="text-2xl h-screen flex items-center justify-center text-gray-400">
			<p>
				No data for this game. Enter{' '}
				<Link to={APP_ROUTES.dashboard.playerStats.create} className="underline text-blue-500 cursor-pointer">
					stats
				</Link>
				{' here.'}
			</p>
		</div>
	);
};

export default GameErrorPage;
