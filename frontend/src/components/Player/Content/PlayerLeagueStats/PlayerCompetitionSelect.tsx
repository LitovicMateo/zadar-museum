import React from 'react';
import { useParams } from 'react-router-dom';
import AppSelect from '@/components/forms/shared/AppSelect';

import { selectStyle } from '@/constants/ReactSelectStyle';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/UseAllTimeLeagueStats';
import { useCompetitions } from '@/hooks/queries/dasboard/UseCompetitions';
import { PlayerCareerStats } from '@/types/api/Player';

type Props = {
	selectedCompetition: string;
	setSelectedCompetition: React.Dispatch<React.SetStateAction<string>>;
};

type Option = { value: string; label: string };

/** Resolve the league slug an all-time-league entry belongs to. */
const slugOf = (entry: PlayerCareerStats): string | undefined =>
	entry.total.total?.league_slug ??
	entry.total.home?.league_slug ??
	entry.total.away?.league_slug ??
	entry.total.neutral?.league_slug ??
	undefined;

/** Competition filter for the League tab records — the competitions this player played in. */
const PlayerCompetitionSelect: React.FC<Props> = ({ selectedCompetition, setSelectedCompetition }) => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const { data: league } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const { data: competitions } = useCompetitions('slug', 'asc');

	const options: Option[] = [{ label: 'All Competitions', value: '' }];
	const seen = new Set<string>();
	(league ?? []).forEach((entry) => {
		const slug = slugOf(entry);
		if (!slug || seen.has(slug)) return;
		seen.add(slug);
		const name = competitions?.find((c) => c.slug === slug)?.name ?? slug;
		options.push({ label: name, value: slug });
	});

	return (
		<AppSelect<Option>
			placeholder="Competition"
			className="text-sm"
			options={options}
			value={options.find((o) => o.value === selectedCompetition) ?? options[0]}
			onChange={(opt) => setSelectedCompetition(opt?.value ?? '')}
			styles={selectStyle()}
		/>
	);
};

export default PlayerCompetitionSelect;
