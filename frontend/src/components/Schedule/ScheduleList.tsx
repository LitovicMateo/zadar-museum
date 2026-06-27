import React from 'react';

import { groupByCompetition } from '@/components/Games/GamesList/GamesList.util';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';
import { useTeamLogos } from '@/hooks/queries/team/UseTeamLogos';
import { TeamScheduleResponse } from '@/types/api/Team';

import GameCard from './GameCard';

type ScheduleListProps = {
	schedule?: TeamScheduleResponse[];
	/** Team whose win/loss drives card colouring. Defaults to the main team (KK Zadar). */
	perspectiveSlug?: string;
	/** Render the competition name as a title above each competition's games. */
	showCompetitionTitle?: boolean;
};

export const ScheduleList: React.FC<ScheduleListProps> = ({
	schedule = [],
	perspectiveSlug,
	showCompetitionTitle = true
}) => {
	const { data: mainTeam } = useMainTeam();
	const logos = useTeamLogos();

	const effectivePerspective = perspectiveSlug ?? mainTeam?.slug;
	const competitions = groupByCompetition(schedule);

	if (competitions.length === 0) return null;

	return (
		<div className="flex flex-col gap-8">
			{competitions.map((comp) => (
				<section key={comp.leagueId} className="flex flex-col gap-3">
					{showCompetitionTitle && (
						<h2 className="text-lg font-semibold text-foreground">{comp.leagueName}</h2>
					)}
					{comp.sections.map((section) => (
						<div key={section.key} className="flex flex-col gap-2">
							{section.heading && (
								<p className="text-sm font-medium text-muted-foreground">{section.heading}</p>
							)}
							{section.items.map(({ game, roundLabel }) => (
								<GameCard
									key={game.game_document_id}
									game={game}
									roundLabel={roundLabel}
									perspectiveSlug={effectivePerspective}
									logos={logos}
								/>
							))}
						</div>
					))}
				</section>
			))}
		</div>
	);
};
