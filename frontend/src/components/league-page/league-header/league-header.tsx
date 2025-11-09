import React from 'react';
import { useParams } from 'react-router-dom';

import { zadarBg } from '@/constants/player-bg';
import { useLeagueDetails } from '@/hooks/queries/league/useLeagueDetails';

const LeagueHeader: React.FC = () => {
	const { leagueSlug } = useParams();

	const { data: leagueDetails } = useLeagueDetails(leagueSlug!);

	return (
		<section className={`w-full flex justify-center items-center min-h-[100px] ${zadarBg}`}>
			<h2 className="text-blue-50 text-2xl font-mono uppercase tracking-widest">{leagueDetails?.name}</h2>
		</section>
	);
};

export default LeagueHeader;
