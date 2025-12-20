import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Heading from '@/components/ui/heading';
import { useCoachGamelog } from '@/hooks/queries/coach/useCoachGamelog';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';
import { useScheduleTable } from '@/hooks/useScheduleTable';

import CoachSeasonStats from './coach-season-stats';
import Filters from './filters';

const CoachGamelog: React.FC = () => {
	const { coachId } = useParams();

	if (!coachId) return null;

	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
	const [selectedSeason, setSelectedSeason] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const { db } = useCoachProfileDatabase(coachId);

	const { data: coachGamelog } = useCoachGamelog(coachId, db);

	React.useEffect(() => {
		if (!selectedSeason && coachGamelog && coachGamelog.length) {
			setSelectedSeason(coachGamelog[0].season || '');
		}
	}, [coachGamelog, selectedSeason]);

	const filteredGames = useMemo(() => {
		if (!coachGamelog) return [];

		return coachGamelog.filter((game) => {
			const matchesCompetition =
				selectedCompetitions.length === 0 ? false : selectedCompetitions.includes(game.league_id);

			const matchesSearch =
				searchTerm.trim().length === 0 ||
				game.home_team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				game.away_team_name.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesCompetition && matchesSearch;
		});
	}, [coachGamelog, selectedCompetitions, searchTerm]);

	const { Schedule } = useScheduleTable(filteredGames || []);

	return (
		<section className="flex flex-col gap-2 font-abel" aria-live="polite">
			<Heading title="Seasonal Data" />
			<div className="flex flex-col gap-8 ">
				<Filters
					selectedSeason={selectedSeason}
					setSelectedSeason={setSelectedSeason}
					selectedCompetitions={selectedCompetitions}
					setSelectedCompetitions={setSelectedCompetitions}
					setSearchTerm={setSearchTerm}
					searchTerm={searchTerm}
				/>
				<div className="flex flex-col gap-2">
					<Heading title="Season Stats" type="secondary" />
					<CoachSeasonStats season={selectedSeason} />
				</div>
				<div className="flex flex-col gap-2">
					<Heading title="Gamelog" type="secondary" />
					<Schedule />
				</div>
			</div>
		</section>
	);
};

export default React.memo(CoachGamelog);
