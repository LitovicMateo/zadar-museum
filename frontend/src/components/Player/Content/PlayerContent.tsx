import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import NoContent from '@/components/NoContent/NoContent';
import CareerHigh from '@/components/Player/Content/PlayerCareerHigh/CareerHigh';
import AllTimeStats from '@/components/Player/Content/PlayerCareerStats/AllTimeStats';
import AllTimeLeagueStats from '@/components/Player/Content/PlayerLeagueStats/PlayerLeagueStats';
import Menu from '@/components/Player/menu/Menu';
import { ActiveTab, ActiveTabLabel, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/Tabs';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/UseAllTimeStats';
import { usePlayerProfileDatabase } from '@/hooks/queries/player/UsePlayerProfileDatabase';
import { AnimatePresence } from 'framer-motion';

import GamelogTab from './PlayerGamelog';
import SeasonTab from './PlayerSeasonStats/PlayerSeasonStats';

import styles from './PlayerContent.module.css';

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
	const { selectedDatabase } = useBoxscore();

	const [activeTab, setActiveTab] = useState<string>('career');
	const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

	const handleTabChange = useCallback((value: string) => {
		setActiveTab(value);
		const el = tabRefs.current[value];
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
		}
	}, []);

	const data = usePlayerProfileDatabase(playerId!);
	const { data: stats } = useAllTimeStats(playerId!, selectedDatabase!);

	if (stats?.length === 0) {
		return <NoContent type="info" description={<p>This player did not participate in any games.</p>} />;
	}

	return (
		<div className={styles.wrapper}>
			<Menu showMenu={data.enableSwitch} />
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
		</div>
	);
});

PlayerContent.displayName = 'PlayerContent';

export default PlayerContent;
