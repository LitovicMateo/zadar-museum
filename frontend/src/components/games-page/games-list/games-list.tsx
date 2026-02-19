import React, { useMemo } from 'react';

import Heading from '@/components/ui/heading';
import { useGamesContext } from '@/hooks/context/useGamesContext';
import { ScheduleList } from '@/hooks/useScheduleTable';

type GamesListProps = {
	competitionSlug: string;
};

const GamesList: React.FC<GamesListProps> = ({ competitionSlug }) => {
	const { filteredSchedule, scheduleLoading, competitions } = useGamesContext();

	const leagueName = competitions?.find((c) => c.league_id === competitionSlug)?.league_name;

	const competitionGames = useMemo(
		() =>
			filteredSchedule?.filter((g) => g.league_id === competitionSlug).sort((a, b) => +a.round - +b.round) ?? [],
		[filteredSchedule, competitionSlug]
	);

	if (scheduleLoading) {
		return <div>Loading...</div>;
	}

	return (
		<section className="w-full flex flex-col gap-4">
			<Heading title={leagueName ?? ''} type="secondary" />
			<ScheduleList schedule={competitionGames} />
		</section>
	);
};

export default GamesList;
