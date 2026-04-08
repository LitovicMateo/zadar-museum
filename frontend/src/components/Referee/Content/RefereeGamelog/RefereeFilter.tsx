import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';
import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import { API_ROUTES } from '@/constants/Routes';
import { useRefereeSeasons } from '@/hooks/queries/referee/UseRefereeSeasons';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import styles from './RefereeFilter.module.css';

type RefereeFilterProps = {
	season: string;
	setSeason: React.Dispatch<React.SetStateAction<string>>;
	setSelectedCompetitions: React.Dispatch<React.SetStateAction<string[]>>;
	selectedCompetitions: string[];
};

const RefereeFilter: React.FC<RefereeFilterProps> = ({
	season,
	selectedCompetitions,
	setSelectedCompetitions,
	setSeason
}) => {
	const { refereeId } = useParams();

	const { data: competitions } = useQuery({
		queryKey: ['referee-competitions', refereeId, season],
		enabled: !!season,
		queryFn: async (): Promise<
			{ league_id: string; league_name: string; league_short_name: string; competition_slug: string }[]
		> => {
			const res = await axios.get(API_ROUTES.referee.competitions(refereeId!, season));
			return res.data;
		}
	});

	const { data: seasons } = useRefereeSeasons(refereeId!);

	useEffect(() => {
		if (seasons && seasons.length > 0) {
			setSeason(seasons[0]);
		}
	}, [seasons, setSeason]);

	useEffect(() => {
		if (competitions && competitions.length > 0) {
			setSelectedCompetitions(competitions.map((c) => c.league_id));
		}
	}, [competitions, season, setSelectedCompetitions]);

	const toggleCompetition = (slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	};

	if (!seasons || !competitions) return null;

	return (
		<div className={styles.wrapper}>
			<div className={styles.competitions}>
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
			<SeasonSelect seasons={seasons} selectedSeason={season} onSeasonChange={setSeason} />
		</div>
	);
};

export default RefereeFilter;
