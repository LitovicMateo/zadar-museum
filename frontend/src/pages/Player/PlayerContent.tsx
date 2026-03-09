import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import NoContent from '@/components/no-content/no-content';
import AllTimeLeagueStats from '@/components/player-page/all-time-league-stats/all-time-league-stats';
import AllTimeStats from '@/components/player-page/all-time-stats/all-time-stats';
import CareerHigh from '@/components/player-page/career-high/career-high';
import Menu from '@/components/player-page/menu/menu';
import Boxscore from '@/components/player-page/player-boxscore/boxscore/boxscore';
import BoxscoreFilter from '@/components/player-page/player-boxscore/filter/boxscore-filter';
import SeasonAverage from '@/components/player-page/player-boxscore/season-average/season-average';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeStats } from '@/hooks/queries/player/useAllTimeStats';
import { usePlayerProfileDatabase } from '@/hooks/queries/player/usePlayerProfileDatabase';

import styles from './player-content.module.css';

const TABS = [
	{ value: 'career', label: 'Career' },
	{ value: 'season', label: 'Season' },
	{ value: 'league', label: 'League' },
	{ value: 'gamelog', label: 'Gamelog' },
	{ value: 'career-highs', label: 'Career Highs' },
] as const;

const PlayerContent: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase, competitions, selectedCompetitions, toggleCompetition } = useBoxscore();

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

	const uniqueCompetitions = useMemo(() => {
		const seen = new Set<string>();
		return competitions.filter((c) => {
			if (seen.has(c.league_id)) return false;
			seen.add(c.league_id);
			return true;
		});
	}, [competitions]);

	if (stats?.length === 0) {
		return <NoContent type="info" description={<p>This player did not participate in any games.</p>} />;
	}

	return (
		<PageContentWrapper fillHeight>
			<Menu showMenu={data.enableSwitch} />
			<Tabs value={activeTab} onValueChange={handleTabChange} className={styles.tabs}>
				<TabsList className={styles.tabsList} aria-label="Player statistics sections">
					{TABS.map((tab) => (
						<TabsTrigger
							key={tab.value}
							value={tab.value}
							className={styles.tabsTrigger}
							ref={(el) => { tabRefs.current[tab.value] = el; }}
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

				<TabsContent value="season" className={styles.tabsContent}>
					<BoxscoreFilter />
					<SeasonAverage />
				</TabsContent>

				<TabsContent value="gamelog" className={styles.tabsContentGamelog}>
					<div className={styles.gamelogControls}>
						<div className={styles.gamelogSeasonSelect}>
							<BoxscoreFilter />
						</div>
						{uniqueCompetitions.length > 1 && (
							<div className={styles.competitionList}>
								{uniqueCompetitions.map((c) => (
									<CompetitionSelectItem
										key={String(c.league_id)}
										leagueId={String(c.league_id)}
										leagueName={c.league_name}
										onCompetitionChange={toggleCompetition}
										selectedCompetitions={selectedCompetitions}
									/>
								))}
							</div>
						)}
					</div>
					<div className={styles.gamelogCard}>
					<div className={styles.gamelogScrollArea}>
						<Boxscore />
					</div>
					</div>
				</TabsContent>

				<TabsContent value="league" className={styles.tabsContent}>
					<AllTimeLeagueStats />
				</TabsContent>

				<TabsContent value="career-highs" className={styles.tabsContentCentered}>
					<CareerHigh />
				</TabsContent>
			</Tabs>
		</PageContentWrapper>
	);
});

PlayerContent.displayName = 'PlayerContent';

export default PlayerContent;
