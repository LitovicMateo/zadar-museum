import React, { useMemo } from 'react';

import CompetitionSelectItem from '@/components/Games/GamesFilter/CompetitionSelect';
import Boxscore from '@/components/Player/Content/PlayerBoxscore/boxscore/Boxscore';
import BoxscoreFilter from '@/components/Player/Content/PlayerBoxscore/filter/BoxscoreFilter';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { MobileFilterSheet } from '@/components/UI/MobileFilterSheet';
import { useBoxscore } from '@/hooks/context/UseBoxscore';

const PlayerGamelog: React.FC = () => {
	const { competitions, selectedCompetitions, toggleCompetition } = useBoxscore();

	const uniqueCompetitions = useMemo(() => {
		const seen = new Set<string>();
		return competitions.filter((c) => {
			if (seen.has(c.league_id)) return false;
			seen.add(c.league_id);
			return true;
		});
	}, [competitions]);

	return (
		<section className="space-y-4">
			<MobileFilterSheet title="Filter games">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
					<BoxscoreFilter />
					{uniqueCompetitions.length > 1 && (
						<div className="flex flex-wrap items-center gap-2">
							{uniqueCompetitions.map((c) => (
								<CompetitionSelectItem
									key={String(c.league_id)}
									leagueId={String(c.league_id)}
									leagueName={c.league_name}
									leagueShortName={c.league_short_name}
									onCompetitionChange={toggleCompetition}
									selectedCompetitions={selectedCompetitions}
								/>
							))}
						</div>
					)}
				</div>
			</MobileFilterSheet>
			<div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
				<DynamicContentWrapper>
					<Boxscore />
				</DynamicContentWrapper>
			</div>
		</section>
	);
};

export default PlayerGamelog;
