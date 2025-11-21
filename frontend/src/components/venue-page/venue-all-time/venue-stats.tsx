import React from 'react';

import VenueStatRow from './venue-stat-row';

type Record = {
	games?: number;
	wins?: number;
	losses?: number;
	win_percentage?: number | string;
	avg_attendance?: number | string;
};

const VenueStats: React.FC<{ record: Record }> = ({ record }) => {
	return (
		<div className="w-full max-w-xl">
			<div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden">
				<ul className="font-abel">
					<VenueStatRow header label="Statistic" value="Score" />
					<VenueStatRow label="Games" value={record?.games ?? 0} />
					<VenueStatRow label="Wins" value={record?.wins ?? 0} />
					<VenueStatRow label="Losses" value={record?.losses ?? 0} />
					<VenueStatRow label="Win Percentage" value={record?.win_percentage ?? 0} />
					<VenueStatRow label="Average Attendance" value={record?.avg_attendance ?? 0} />
				</ul>
			</div>
		</div>
	);
};

export default VenueStats;
