import React from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';

const AllTimeStats: React.FC = () => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data, isLoading } = useAllTimeStats(playerId!, selectedDatabase!);

	if (isLoading || !data) return null;
	const totalStats = data[0].total.total;

	return (
		<section className="flex flex-col gap-4">
			<Heading title="All Time Stats" />
			<ul className="font-abel text-lg">
				<li className="flex justify-between border-b-1 border-solid border-gray-500 px-2 py-2 font-semibold bg-slate-100 text-xl">
					<span>Statistic</span>
					<span>Record (Rank)</span>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Games</div>
						<div className="flex gap-2 items-baseline">
							<span className="font-bold">{totalStats.games}</span>
							<span className="">({totalStats.games_rank}.)</span>
						</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Points</div>
						<div className="flex gap-2 items-baseline">
							<span className="font-bold">{totalStats.points}</span>
							<span className="">({totalStats.points_rank}.)</span>
						</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Rebounds</div>
						<div className="flex gap-2 items-baseline">
							<span className="font-bold">{totalStats.rebounds}</span>
							<span className="">({totalStats.rebounds_rank}.)</span>
						</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>Assists</div>
						<div className="flex gap-2 items-baseline">
							<span className="font-bold">{totalStats.assists}</span>
							<span className="">({totalStats.assists_rank}.)</span>
						</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>3PT</div>
						<div className="flex gap-2 items-baseline">
							<span className="font-bold">{totalStats.three_pointers_made}</span>
							<span className="">({totalStats.three_pointers_made_rank}.)</span>
						</div>
					</div>
				</li>
				<li>
					<div className="flex justify-between px-2 py-2 hover:bg-gray-50 border-b-1 border-solid border-gray-500">
						<div>FT</div>
						<div className="flex gap-2 items-baseline">
							<span className="font-bold">{totalStats.free_throws_made}</span>
							<span className="">({totalStats.free_throws_made_rank}.)</span>
						</div>
					</div>
				</li>
			</ul>
		</section>
	);
};

export default AllTimeStats;
