import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import LeagueAllTime from '@/components/League/LeaguePage/Content/LeagueAllTimeStats/LeagueAllTimeStats';
import PlayerRankings from '@/components/League/LeaguePage/Content/LeaguePlayerRankings/LeaguePlayerRankings';
import NoContent from '@/components/no-content/NoContent';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import SeasonData from '@/components/venue-page/season-data/SeasonData';
import { useLeagueSeasons } from '@/hooks/queries/league/UseLeagueSeasons';
import { AnimatePresence } from 'framer-motion';

import styles from './LeagueContent.module.css';

const TABS = [
	{ value: 'alltime', label: 'All Time' },
	{ value: 'season', label: 'Season Data' },
	{ value: 'playerStats', label: 'Player Stats' },
	{ value: 'gamelog', label: 'Game Log' },
	{ value: 'playerRankings', label: 'Player Rankings' },
	{ value: 'coachRankings', label: 'Coach Rankings' }
] as const;

type TabValue = (typeof TABS)[number]['value'];

const TAB_PANELS: { value: TabValue; content: React.ReactNode }[] = [
	{ value: 'alltime', content: <LeagueAllTime /> },
	{ value: 'playerRankings', content: <PlayerRankings /> },
	{ value: 'season', content: <SeasonData /> },
	{ value: 'gamelog', content: <div>Game Log</div> },
	{ value: 'playerStats', content: <div>Player Stats</div> },
	{ value: 'coachRankings', content: <div>Coach Rankings</div> }
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
						<div className={styles.contentWrapper}>{content}</div>
					</TabsContent>
				))}
			</Tabs>
		</PageContentWrapper>
	);
};

export default LeagueContent;
