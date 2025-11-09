import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useVenueTeamRecord } from '@/hooks/queries/venue/useVenueTeamRecord';

const VenueAllTime: React.FC = () => {
	const { venueSlug } = useParams();

	const { data: record } = useVenueTeamRecord(venueSlug!);

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All Time Record" />
			<ul className="font-abel text-base">
				<li className="flex justify-between border-b-1 border-solid border-gray-500 px-2 py-2 font-semibold bg-slate-100 text-lg">
					<span>Statistic</span>
					<span>Score</span>
				</li>
				<li className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
					<div>Games</div>
					<div>{record?.games}</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Wins</div>
						<div>{record?.wins}</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Losses</div>
						<div>{record?.losses}</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Win Percentage</div>
						<div>{record?.win_percentage}</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Average Attenance</div>
						<div>{record?.avg_attendance}</div>
					</div>
				</li>
			</ul>
		</section>
	);
};

export default VenueAllTime;
