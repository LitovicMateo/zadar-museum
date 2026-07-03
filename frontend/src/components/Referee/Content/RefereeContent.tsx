import React, { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-tabs';

import RefereeCareerStats from './RefereeCareerStats/RefereeCareerStats';
import RefereeGamelog from './RefereeGamelog/RefereeGamelog';
import RefereeLeagueStats from './RefereeLeagueStats/RefereeLeagueStats';
import RefereeSeasonStats from './RefereeSeasonStats/RefereeSeasonStats';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'league', label: 'League' },
	{ value: 'season', label: 'Season' },
	{ value: 'gamelog', label: 'Gamelog' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <RefereeCareerStats /> },
	{ value: 'league', content: <RefereeLeagueStats /> },
	{ value: 'season', content: <RefereeSeasonStats /> },
	{ value: 'gamelog', content: <RefereeGamelog /> }
];

const RefereeContent: React.FC = React.memo(() => {
	const [activeTab, setActiveTab] = useState<string>('alltime');

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
			<div className="sticky top-0 z-20 -mx-4 border-b border-border bg-chalk/85 px-4 backdrop-blur sm:-mx-6 sm:px-6">
				<div className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
					<TabsList
						aria-label="Referee statistics sections"
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

RefereeContent.displayName = 'RefereeContent';

export default RefereeContent;
