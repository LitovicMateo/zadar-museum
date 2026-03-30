import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';
import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { ScheduleList } from '@/components/Schedule/ScheduleList';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { API_ROUTES } from '@/constants/Routes';
import { useRefereeGamelog } from '@/hooks/queries/referee/UseRefereeGamelog';
import { useRefereeSeasons } from '@/hooks/queries/referee/UseRefereeSeasons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import styles from './RefereeGamelog.module.css';

const RefereeGamelog: React.FC = () => {
	const { refereeId } = useParams();
	const [selectedSeason, setSelectedSeason] = React.useState('');
	const [selectedCompetitions, setSelectedCompetitions] = React.useState<string[]>([]);

	const { data: seasons } = useRefereeSeasons(refereeId!);

	const { data: refereeGamelog } = useRefereeGamelog(refereeId!);

	const { data: competitions } = useQuery({
		queryKey: ['referee-competitions', refereeId, selectedSeason],
		enabled: !!selectedSeason,
		queryFn: async (): Promise<
			{ league_id: string; league_name: string; league_short_name: string; competition_slug: string }[]
		> => {
			const res = await axios.get(API_ROUTES.referee.competitions(refereeId!, selectedSeason));
			return res.data;
		}
	});

	const filteredGames = React.useMemo(() => {
		if (!refereeGamelog) return [];
		const filtered = refereeGamelog.filter((g) => selectedCompetitions.includes(g.league_id));
		return filtered;
	}, [refereeGamelog, selectedCompetitions]);

	const toggleCompetition = (slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	};

	useEffect(() => {
		if (competitions && competitions.length > 0) {
			setSelectedCompetitions(competitions.map((c) => c.league_id));
		}
	}, [competitions, selectedSeason, setSelectedCompetitions]);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	if (refereeGamelog === undefined || !competitions || !seasons) return null;

	return (
		<section className={styles.section}>
			<div className={styles.topFilters}>
				<SeasonSelect
					compact
					seasons={seasons}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
				/>
			</div>
			<div className={styles.filters}>
				{competitions.map((c) => (
					<CompetitionSelectItem
						key={c.league_id}
						leagueId={c.league_id}
						leagueName={c.league_name}
						leagueShortName={c.league_short_name}
						onCompetitionChange={toggleCompetition}
						selectedCompetitions={selectedCompetitions}
					/>
				))}
			</div>
			<DynamicContentWrapper>
				<div className={styles.gamelogCard}>
					<ScheduleList schedule={filteredGames} />
				</div>
			</DynamicContentWrapper>
		</section>
	);
};

export default RefereeGamelog;
