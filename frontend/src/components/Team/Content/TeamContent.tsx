import React, { useState } from 'react';

import TeamAllTimeStats from '@/components/Team/Content/TeamAllTimeStats/TeamAllTimeStats';
import TeamLeaders from '@/components/Team/Content/TeamLeaders/TeamLeaders';
import TeamLeagueStats from '@/components/Team/Content/TeamLeagueStats/TeamLeagueStats';
import TeamRecords from '@/components/Team/Content/TeamRecords/TeamRecords';
import TeamSeasonStats from '@/components/Team/Content/TeamSeasonStats/TeamSeasonStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-tabs';

import TeamGamelog from './TeamGamelog/TeamGamelog';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'league', label: 'League' },
	{ value: 'season', label: 'Season' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'leaders', label: 'Leaders' },
	{ value: 'player records', label: 'Player Records' },
	{ value: 'team records', label: 'Team Records' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <TeamAllTimeStats /> },
	{ value: 'league', content: <TeamLeagueStats /> },
	{ value: 'season', content: <TeamSeasonStats /> },
	{ value: 'gamelog', content: <TeamGamelog /> },
	{ value: 'leaders', content: <TeamLeaders /> },
	{ value: 'player records', content: <TeamRecords variant="player" /> },
	{ value: 'team records', content: <TeamRecords variant="team" /> }
];

const TeamContent: React.FC = React.memo(() => {
	const [activeTab, setActiveTab] = useState<string>('alltime');

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
			<div className="sticky top-0 z-20 -mx-4 border-b border-border bg-chalk/85 px-4 backdrop-blur sm:-mx-6 sm:px-6">
				<div className="py-3">
					<TabsList
						aria-label="Team statistics sections"
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

TeamContent.displayName = 'TeamContent';

export default TeamContent;
