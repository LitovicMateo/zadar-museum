import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import Heading from '@/components/ui/Heading';
import Separator from '@/components/ui/Separator';
import { useCoachGamelog } from '@/hooks/queries/coach/UseCoachGamelog';
import { useCoachSeasons } from '@/hooks/queries/coach/UseCoachSeasons';
import { useCoachProfileDatabase } from '@/hooks/queries/player/UseCoachProfileDatabase';

import Filters from '../../Coach/CoachPage/Content/CoachGamelog/filters/Filters';
import CoachSeasonStats from './season-stats/CoachSeasonStats';

import styles from './CoachGamelog.module.css';

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
				selectedCompetitions.length === 0 || selectedCompetitions.includes(String(game.league_id));

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
