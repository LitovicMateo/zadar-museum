import React, { useCallback, useRef, useState } from 'react';

import TeamAllTimeStats from '@/components/Team/TeamPage/Content/TeamAllTimeStats/TeamAllTimeStats';
import TeamLeaders from '@/components/Team/TeamPage/Content/TeamLeaders/TeamLeaders';
import TeamLeagueStats from '@/components/Team/TeamPage/Content/TeamLeagueStats/TeamLeagueStats';
import TeamSeasonStats from '@/components/Team/TeamPage/Content/TeamSeasonStats/TeamSeasonStats';
import CompetitionList from '@/components/games-page/games-filter/CompetitionList';
import GamesFilter from '@/components/games-page/games-filter/GamesFilter';
import RightControls from '@/components/games-page/games-filter/RightControls';
import GamesList from '@/components/games-page/games-list/GamesList';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useGamesContext } from '@/hooks/context/UseGamesContext';
import { AnimatePresence } from 'framer-motion';

import TeamGamelog from './TeamGamelog/TeamGamelog';

import styles from './TeamContent.module.css';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'league', label: 'League' },
	{ value: 'season', label: 'Season' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'leaders', label: 'Leaders' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <TeamAllTimeStats /> },
	{ value: 'league', content: <TeamLeagueStats /> },
	{ value: 'season', content: <TeamSeasonStats /> },
	{ value: 'gamelog', content: <TeamGamelog /> },
	{ value: 'leaders', content: <TeamLeaders /> }
];

const TeamContent: React.FC = React.memo(() => {
	const [activeTab, setActiveTab] = useState<string>('alltime');
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const handleTabChange = useCallback((value: string) => {
		setActiveTab(value);
		const el = tabRefs.current[value];
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
		}
	}, []);

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
						<div className={styles.contentWrapper}>{content}</div>
					</TabsContent>
				))}
			</Tabs>
			{/* <Tabs defaultValue="alltime" className={styles.tabs}>
				<TabsList className={styles.tabsList} aria-label="Team statistics sections">
					<TabsTrigger value="gamelog" className={styles.tabsTrigger}>
						Gamelog
					</TabsTrigger>
					<TabsTrigger value="leaders" className={styles.tabsTrigger}>
						Leaders
					</TabsTrigger>
				</TabsList>

				<TabsContent value="alltime" className={styles.tabsContent}>
					<TeamAllTimeStats />
				</TabsContent>

				<TabsContent value="league" className={styles.tabsContent}>
					<TeamLeagueStats />
				</TabsContent>

				<TabsContent value="season" className={styles.tabsContent}>
					<GamesFilter showCompetitions={false} />
					<TeamSeasonStats />
				</TabsContent>


				<TabsContent value="leaders" className={styles.tabsContent}>
					<TeamLeaders />
				</TabsContent>
			</Tabs> */}
		</PageContentWrapper>
	);
});

TeamContent.displayName = 'TeamContent';

export default TeamContent;
