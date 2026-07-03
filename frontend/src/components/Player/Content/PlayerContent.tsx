import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import CareerHigh from '@/components/Player/Content/PlayerCareerHigh/CareerHigh';
import AllTimeStats from '@/components/Player/Content/PlayerCareerStats/AllTimeStats';
import AllTimeLeagueStats from '@/components/Player/Content/PlayerLeagueStats/PlayerLeagueStats';
import DatabaseToggle from '@/components/Player/menu/DatabaseToggle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-tabs';
import { usePlayerProfileDatabase } from '@/hooks/queries/player/UsePlayerProfileDatabase';
import { usePlayerTeams } from '@/hooks/queries/player/UsePlayerTeams';

import GamelogTab from './PlayerGamelog';
import SeasonTab from './PlayerSeasonStats/PlayerSeasonStats';

const TABS = [
	{ value: 'career', label: 'Career' },
	{ value: 'season', label: 'Season' },
	{ value: 'league', label: 'League' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'career-highs', label: 'Career Highs' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'career', content: <AllTimeStats /> },
	{ value: 'season', content: <SeasonTab /> },
	{ value: 'league', content: <AllTimeLeagueStats /> },
	{ value: 'gamelog', content: <GamelogTab /> },
	{ value: 'career-highs', content: <CareerHigh /> }
];

const PlayerContent: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const [activeTab, setActiveTab] = useState<string>('career');

	const { enableSwitch } = usePlayerProfileDatabase(playerId!);
	const { data: teams } = usePlayerTeams(playerId!);

	if (teams?.length === 0) {
		return <NoContent type="info" description={<p>This player did not participate in any games.</p>} />;
	}

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
			<div className="sticky top-0 z-20 -mx-4 border-b border-border bg-chalk/85 px-4 backdrop-blur sm:-mx-6 sm:px-6">
				<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
					<TabsList
						aria-label="Player statistics sections"
						className="h-auto max-w-full justify-start gap-1 overflow-x-auto rounded-lg bg-muted p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
					>
						{TABS.map((tab) => (
							<TabsTrigger
								key={tab.value}
								value={tab.value}
								className="flex-none rounded-md px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted-foreground data-[state=active]:bg-court data-[state=active]:text-record"
							>
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>
					{enableSwitch && <DatabaseToggle className="shrink-0 self-start sm:self-auto" />}
				</div>
			</div>

			<div className="pt-6">
				{TAB_PANELS.map(({ value, content }) => (
					<TabsContent key={value} value={value}>
						{content}
					</TabsContent>
				))}
			</div>
		</Tabs>
	);
});

PlayerContent.displayName = 'PlayerContent';

export default PlayerContent;
