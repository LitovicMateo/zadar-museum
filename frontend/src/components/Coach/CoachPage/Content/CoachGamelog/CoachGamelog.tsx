import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { useCoachGamelog } from '@/hooks/queries/coach/UseCoachGamelog';
import { useCoachSeasonCompetitions } from '@/hooks/queries/coach/UseCoachSeasonCompetitions';
import { useCoachSeasons } from '@/hooks/queries/coach/UseCoachSeasons';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';

import CoachGamelogFilters from './Filters/CoachGamelogFilters';

import styles from './CoachGamelog.module.css';

const CoachGamelog: React.FC = () => {
	const { coachId } = useParams();

	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
	const [selectedSeason, setSelectedSeason] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const { data: seasons } = useCoachSeasons(coachId!);

	const { db } = useCoachProfileDatabase(coachId!);

	const { data: competitions } = useCoachSeasonCompetitions(coachId!, selectedSeason);

	const uniqueCompetitions = useMemo(() => {
		if (!competitions) return [];
		const seen = new Set<string>();
		return competitions.filter((c) => {
			const id = String(c.league_id);
			if (seen.has(id)) return false;
			seen.add(id);
			setSelectedCompetitions((prev) => [...prev, id]); // Auto-select all competitions by default
			return true;
		});
	}, [competitions]);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons]);

	const { data: coachGamelog } = useCoachGamelog(coachId!, db);

	const filteredGames = useMemo(() => {
		if (!coachGamelog) return [];

		return coachGamelog.filter((game) => {
			const matchesCompetition = selectedCompetitions.includes(String(game.league_id));

			const matchesSearch =
				searchTerm.trim().length === 0 ||
				game.home_team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				game.away_team_name.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesCompetition && matchesSearch;
		});
	}, [coachGamelog, selectedCompetitions, searchTerm]);

	return (
		<section className={styles.section}>
			<CoachGamelogFilters
				seasons={seasons || []}
				selectedSeason={selectedSeason}
				setSelectedSeason={setSelectedSeason}
				selectedCompetitions={selectedCompetitions}
				setSelectedCompetitions={setSelectedCompetitions}
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				competitions={uniqueCompetitions}
			/>

			<div className={styles.gamelogCard}>
				<DynamicContentWrapper>
					<ScheduleList schedule={filteredGames} />
				</DynamicContentWrapper>
			</div>
		</section>
	);
};

export default CoachGamelog;
