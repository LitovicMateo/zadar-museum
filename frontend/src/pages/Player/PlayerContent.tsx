import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

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

const PlayerContent: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase, competitions, selectedCompetitions, toggleCompetition } = useBoxscore();

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
		<PageContentWrapper>
			<Menu showMenu={data.enableSwitch} />
			<Tabs defaultValue="career" className={styles.tabs}>
				<TabsList className={styles.tabsList} aria-label="Player statistics sections">
					<TabsTrigger value="career" className={styles.tabsTrigger}>Career</TabsTrigger>
					<TabsTrigger value="season" className={styles.tabsTrigger}>Season</TabsTrigger>
					<TabsTrigger value="gamelog" className={styles.tabsTrigger}>Gamelog</TabsTrigger>
					<TabsTrigger value="league" className={styles.tabsTrigger}>League</TabsTrigger>
				</TabsList>

				<TabsContent value="career" className={styles.tabsContent}>
					<AllTimeStats />
					<CareerHigh />
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
					<div className={styles.gamelogScrollArea}>
						<Boxscore />
					</div>
				</TabsContent>

				<TabsContent value="league" className={styles.tabsContent}>
					<AllTimeLeagueStats />
				</TabsContent>
			</Tabs>
		</PageContentWrapper>
	);
});

PlayerContent.displayName = 'PlayerContent';

export default PlayerContent;
