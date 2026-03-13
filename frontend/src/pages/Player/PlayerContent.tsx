import React, { useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import CareerHigh from '@/components/Player/Content/PlayerCareerHigh/CareerHigh';
import AllTimeStats from '@/components/Player/Content/PlayerCareerStats/AllTimeStats';
import AllTimeLeagueStats from '@/components/Player/Content/PlayerLeagueStats/PlayerLeagueStats';
import Menu from '@/components/Player/menu/Menu';
import NoContent from '@/components/no-content/NoContent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/UseAllTimeStats';
import { usePlayerProfileDatabase } from '@/hooks/queries/player/UsePlayerProfileDatabase';
import { AnimatePresence, motion } from 'framer-motion';

import GamelogTab from '../../components/Player/Content/PlayerGamelog/PlayerGamelog';
import SeasonTab from './SeasonTab';

import styles from './player-content.module.css';

const TABS = [
	{ value: 'career', label: 'Career' },
	{ value: 'season', label: 'Season' },
	{ value: 'league', label: 'League' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'career-highs', label: 'Career Highs' }
] as const;

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
			<Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabs}>
				<TabsList className={styles.tabsList} aria-label="Player statistics sections">
					{TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className={styles.tabsTrigger}
							ref={(el) => {
								tabRefs.current[tab.value] = el;
							}}
						>
							<AnimatePresence>
								{activeTab === tab.value && (
									<motion.div
										className={styles.activeIndicator}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.18 }}
									/>
								)}
							</AnimatePresence>
							<span className={styles.tabsTriggerLabel}>{tab.label}</span>
						</TabsTrigger>
					))}
				</TabsList>

				<TabsContent value="career" className={styles.tabsContentCentered}>
					<AllTimeStats />
				</TabsContent>

				<SeasonTab />

				<GamelogTab />

				<TabsContent value="league" className={styles.tabsContent}>
					<AllTimeLeagueStats />
				</TabsContent>

				<TabsContent value="career-highs" className={styles.tabsContentCentered}>
					<CareerHigh />
				</TabsContent>
			</Tabs>
		</div>
	);
});

PlayerContent.displayName = 'PlayerContent';

export default PlayerContent;
