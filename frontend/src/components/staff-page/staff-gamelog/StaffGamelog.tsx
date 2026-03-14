import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { ScheduleList } from '@/components/Schedule/ScheduleList';
import CompetitionSelectItem from '@/components/games-page/games-filter/CompetitionSelect';
import SearchBar from '@/components/games-page/games-filter/SearchBar';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import NoContent from '@/components/no-content/NoContent';
import Heading from '@/components/ui/Heading';
import { useStaffGamelog } from '@/hooks/queries/staff/UseStaffGamelog';
import { TeamScheduleResponse } from '@/types/api/Team';

import styles from './StaffGamelog.module.css';

// ─── helpers ──────────────────────────────────────────────────────────────────

function deriveSeasons(gamelog: TeamScheduleResponse[]): string[] {
	return [...new Set(gamelog.map((g) => g.season))].sort((a, b) => +b - +a);
}

function deriveCompetitions(gamelog: TeamScheduleResponse[]) {
	const seen = new Set<string>();
	return gamelog.filter((g) => {
		const key = String(g.league_id);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

// ─── component ────────────────────────────────────────────────────────────────

const StaffGamelog: React.FC = () => {
	const { staffId } = useParams();

	const [selectedSeason, setSelectedSeason] = useState('');
	const [selectedCompetitions, setSelectedCompetitions] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState('');

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
				selectedCompetitions.length === 0 || selectedCompetitions.includes(String(g.league_id));

			const matchesSearch =
				searchTerm.trim().length === 0 ||
				g.home_team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				g.away_team_name.toLowerCase().includes(searchTerm.toLowerCase());

			return matchesCompetition && matchesSearch;
		});
	}, [seasonGames, selectedCompetitions, searchTerm]);

	const toggleCompetition = (leagueId: string) => {
		setSelectedCompetitions((prev) =>
			prev.includes(leagueId) ? prev.filter((c) => c !== leagueId) : [...prev, leagueId]
		);
	};

	if (gamelog.length === 0 && seasons.length === 0) {
		return (
			<section className={styles.section}>
				<NoContent type="info" description="No gamelog available for this staff member yet." />
			</section>
		);
	}

	return (
		<section className={styles.section}>
			<div className={styles.headingRow}>
				<Heading title="Gamelog" />
				<SeasonSelect
					seasons={seasons}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
					compact
				/>
			</div>

			<div className={styles.filtersRow}>
				<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				<div className={styles.competitionsRow}>
					{availableCompetitions.map((g) => (
						<CompetitionSelectItem
							key={String(g.league_id)}
							leagueId={String(g.league_id)}
							leagueName={g.league_name}
							leagueShortName={g.league_short_name}
							onCompetitionChange={toggleCompetition}
							selectedCompetitions={selectedCompetitions}
						/>
					))}
				</div>
			</div>

			<ScheduleList schedule={filteredGames} />
		</section>
	);
};

export default StaffGamelog;
