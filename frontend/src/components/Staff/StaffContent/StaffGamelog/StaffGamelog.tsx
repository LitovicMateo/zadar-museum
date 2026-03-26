import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import CompetitionList from '@/components/games-page/games-filter/CompetitionList';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { useStaffGamelog } from '@/hooks/queries/staff/UseStaffGamelog';

import { deriveCompetitions, deriveSeasons } from './StaffGamelog.utils';

import styles from './StaffGamelog.module.css';

// ─── component ────────────────────────────────────────────────────────────────

const StaffGamelog: React.FC = () => {
	const { staffId } = useParams();

	const [selectedSeason, setSelectedSeason] = useState('');
	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);

	const { data: gamelog = [] } = useStaffGamelog(staffId!);

	const seasons = useMemo(() => deriveSeasons(gamelog), [gamelog]);

	// default to latest season once data loads
	useEffect(() => {
		if (seasons.length > 0 && !selectedSeason) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, selectedSeason]);

	// competitions available in the selected season
	const seasonGames = useMemo(
		() => (selectedSeason ? gamelog.filter((g) => g.season === selectedSeason) : gamelog),
		[gamelog, selectedSeason]
	);

	const availableCompetitions = useMemo(() => deriveCompetitions(seasonGames), [seasonGames]);

	// gamelog list filtered by competition + search
	const filteredGames = useMemo(() => {
		return seasonGames.filter((g) => {
			const matchesCompetition =
				selectedCompetitions.length > 0 && selectedCompetitions.includes(String(g.league_id));

			return matchesCompetition;
		});
	}, [seasonGames, selectedCompetitions]);

	const toggleCompetition = (leagueId: string) => {
		setSelectedCompetitions((prev) =>
			prev.includes(leagueId) ? prev.filter((c) => c !== leagueId) : [...prev, leagueId]
		);
	};

	React.useEffect(() => {
		// make all competitions selected by default
		if (availableCompetitions.length > 0 && selectedCompetitions.length === 0) {
			setSelectedCompetitions(availableCompetitions.map((c) => String(c.league_id)));
		}
	}, [availableCompetitions]);

	return (
		<section className={styles.section}>
			<div className={styles.topFilters}>
				<SeasonSelect
					seasons={seasons}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
					compact
				/>
			</div>
			<div className={styles.filters}>
				{/* <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> */}
				<CompetitionList
					selectedCompetitions={selectedCompetitions}
					toggleCompetition={toggleCompetition}
					competitions={availableCompetitions}
					key={selectedSeason}
				/>
			</div>
			<DynamicContentWrapper>
				<div className={styles.gamelogCard}>
					{filteredGames.length === 0 && <p className={styles.empty}>No competitions selected.</p>}
					<ScheduleList schedule={filteredGames} />
				</div>
			</DynamicContentWrapper>{' '}
		</section>
	);
};

export default StaffGamelog;
