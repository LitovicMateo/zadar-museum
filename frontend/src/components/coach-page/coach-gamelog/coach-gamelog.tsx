import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import SeasonSelect from '@/components/games-page/games-filter/season-select';
import Heading from '@/components/ui/heading';
import { useCoachGamelog } from '@/hooks/queries/coach/useCoachGamelog';
import { useCoachProfileDatabase } from '@/hooks/queries/player/useCoachProfileDatabase';
import { useCoachSeasons } from '@/hooks/queries/coach/useCoachSeasons';
import { ScheduleList } from '@/hooks/useScheduleTable';

import Separator from '@/components/ui/separator';
import CoachSeasonStats from './season-stats/coach-season-stats';
import Filters from './filters/filters';
import styles from './coach-gamelog.module.css';

const CoachGamelog: React.FC = () => {
	const { coachId } = useParams();

	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
	const [selectedSeason, setSelectedSeason] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

	const { data: seasons } = useCoachSeasons(coachId!);

	const { db } = useCoachProfileDatabase(coachId!);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons]);

	const { data: coachGamelog } = useCoachGamelog(coachId!, db);

	const filteredGames = useMemo(() => {
		if (!coachGamelog) return [];

		return coachGamelog.filter((game) => {
			const matchesCompetition =
				selectedCompetitions.length === 0 ||
				selectedCompetitions.includes(String(game.league_id));

			const matchesSearch =
				searchTerm.trim().length === 0 ||
				game.home_team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				game.away_team_name.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesCompetition && matchesSearch;
		});
	}, [coachGamelog, selectedCompetitions, searchTerm]);

	return (
		<section className={styles.section}>
			<div className={styles.headingRow}>
				<Heading title="Seasonal Data" />
				<SeasonSelect
					seasons={seasons || []}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
					compact
				/>
			</div>
			<div className={styles.inner}>
				<div className={styles.colGap2}>
					<Heading title="Season Stats" type="secondary" />
					<CoachSeasonStats season={selectedSeason} />
				</div>
				<Separator />
				<div className={styles.colGap2}>
					<Heading title="Gamelog" type="secondary" />
					<Filters
						selectedSeason={selectedSeason}
						selectedCompetitions={selectedCompetitions}
						setSelectedCompetitions={setSelectedCompetitions}
						setSearchTerm={setSearchTerm}
						searchTerm={searchTerm}
					/>
					<ScheduleList schedule={filteredGames} />
				</div>
			</div>
		</section>
	);
};

export default CoachGamelog;
