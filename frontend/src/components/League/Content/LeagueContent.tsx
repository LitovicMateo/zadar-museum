import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import LeagueAllTime from '@/components/League/Content/LeagueAllTimeStats/LeagueAllTimeStats';
import NoContent from '@/components/NoContent/NoContent';
import PageContentWrapper from '@/components/UI/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { AnimatePresence } from 'framer-motion';

import LeagueCoachRankings from './LeagueCoachRankings/LeagueCoachRankings';
import LeagueGamelog from './LeagueGamelog/LeagueGamelog';
import LeaguePlayerRankings from './LeaguePlayerRankings/LeaguePlayerRankings';
import LeaguePlayerStats from './LeaguePlayerStats/LeaguePlayerStats';
import LeagueSeasonStats from './LeagueSeasonStats/LeagueSeasonStats';

import styles from './LeagueContent.module.css';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'season', label: 'Season Data' },
	{ value: 'playerStats', label: 'Player Stats' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'playerRankings', label: 'Player Rankings' },
	{ value: 'coachRankings', label: 'Coach Rankings' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <LeagueAllTime /> },
	{ value: 'season', content: <LeagueSeasonStats /> },
	{ value: 'playerStats', content: <LeaguePlayerStats /> },
	{ value: 'gamelog', content: <LeagueGamelog /> },
	{ value: 'playerRankings', content: <LeaguePlayerRankings /> },
	{ value: 'coachRankings', content: <LeagueCoachRankings /> }
];

const LeagueContent: React.FC = () => {
	const { leagueSlug } = useParams();

	const [activeTab, setActiveTab] = useState<string>('alltime');
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const { data: leagueSeasons } = useLeagueSeasons(leagueSlug!);

	const handleTabChange = useCallback((value: string) => {
		setActiveTab(value);
		const el = tabRefs.current[value];
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
		}
	}, []);

	if (leagueSeasons && leagueSeasons.length === 0)
		return <NoContent type="info" description="No games have been played in this competition." />;

	return (
		<PageContentWrapper>
			<Tabs value={activeTab} onValueChange={handleTabChange}>
				<TabsList aria-label="Player statistics sections">
					{TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							ref={(el) => {
								tabRefs.current[tab.value] = el;
							}}
						>
							<AnimatePresence>{activeTab === tab.value && <ActiveTab />}</AnimatePresence>
							<ActiveTabLabel label={tab.label} />
						</TabsTrigger>
					))}
				</TabsList>

				{TAB_PANELS.map(({ value, content }) => (
					<TabsContent key={value} value={value}>
						{content}
					</TabsContent>
				))}
			</Tabs>
		</PageContentWrapper>
	);
};

export default LeagueContent;
