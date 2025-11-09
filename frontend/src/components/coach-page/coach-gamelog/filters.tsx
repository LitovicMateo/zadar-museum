import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import SearchBar from '@/components/games-page/games-filter/search-bar';
import { selectStyle } from '@/constants/react-select-style';
import { useCoachSeasonCompetitions } from '@/hooks/queries/coach/useCoachSeasonCompetitions';
import { useCoachSeasons } from '@/hooks/queries/coach/useCoachSeasons';

type SeasonOption = {
	value: string;
	label: string;
};

type FilterProps = {
	selectedSeason: string;
	setSelectedSeason: (s: string) => void;
	selectedCompetitions: string[];
	setSelectedCompetitions: React.Dispatch<React.SetStateAction<string[]>>;
	setSearchTerm: (s: string) => void;
	searchTerm: string;
};

const Filters: React.FC<FilterProps> = ({
	selectedSeason,
	setSelectedSeason,
	selectedCompetitions,
	setSelectedCompetitions,
	setSearchTerm,
	searchTerm
}) => {
	const { coachId } = useParams();

	const { data: seasons } = useCoachSeasons(coachId!);

	const { data: competitions } = useCoachSeasonCompetitions(coachId!, selectedSeason);

	useEffect(() => {
		if (seasons) {
			setSelectedSeason(seasons[0]);
		}
	}, [seasons, setSelectedSeason]);

	useEffect(() => {
		if (competitions) {
			setSelectedCompetitions(competitions.map((c) => c.league_id));
		}
	}, [competitions, setSelectedCompetitions]);

	const seasonOptions = seasons?.map((s) => ({ value: s, label: s })) ?? [];

	const toggleCompetition = (slug: string) => {
		setSelectedCompetitions((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
	};

	if (seasons === undefined || competitions === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<div className="flex flex-col sm:flex-row-reverse gap-4 w-full">
			<div className="flex gap-4 w-full ">
				<SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
				<Select<SeasonOption, false>
					placeholder="Season"
					className="text-sm shadow-sm w-full"
					value={seasonOptions.find((s) => s.value === selectedSeason)}
					options={seasonOptions}
					onChange={(e) => setSelectedSeason(e?.value || '')}
					styles={selectStyle()}
				/>
			</div>

			<div className="flex gap-4 w-full justify-between">
				<div className="flex gap-4">
					{competitions.map((c) => (
						<CompetitionSelectItem
							key={c.league_id}
							leagueId={c.league_id}
							leagueName={c.league_name}
							onCompetitionChange={toggleCompetition}
							selectedCompetitions={selectedCompetitions}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Filters;
