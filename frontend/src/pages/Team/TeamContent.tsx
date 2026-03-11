import React from 'react';

import CompetitionList from '@/components/games-page/games-filter/CompetitionList';
import GamesFilter from '@/components/games-page/games-filter/GamesFilter';
import RightControls from '@/components/games-page/games-filter/RightControls';
import GamesList from '@/components/games-page/games-list/GamesList';
import TeamAllTimeStats from '@/components/team-page/all-time-stats/TeamAllTimeStats';
import TeamLeagueStats from '@/components/team-page/league-stats/TeamLeagueStats';
import TeamSeasonStats from '@/components/team-page/team-games/TeamSeasonStats';
import TeamLeaders from '@/components/team-page/team-leaders/TeamLeaders';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from './team-content.module.css';

const TeamContent: React.FC = React.memo(() => {
	const {
		selectedCompetitions,
		competitions,
		toggleCompetition,
		seasons,
		selectedSeason,
		setSelectedSeason,
		scheduleLoading,
	} = useGamesContext();

	return (
		<PageContentWrapper>
			<Tabs defaultValue="alltime" className={styles.tabs}>
				<TabsList className={styles.tabsList} aria-label="Team statistics sections">
					<TabsTrigger value="alltime" className={styles.tabsTrigger}>All Time</TabsTrigger>
					<TabsTrigger value="league" className={styles.tabsTrigger}>League</TabsTrigger>
					<TabsTrigger value="season" className={styles.tabsTrigger}>Season</TabsTrigger>
					<TabsTrigger value="gamelog" className={styles.tabsTrigger}>Gamelog</TabsTrigger>
					<TabsTrigger value="leaders" className={styles.tabsTrigger}>Leaders</TabsTrigger>
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

				<TabsContent value="gamelog" className={styles.tabsContentGamelog}>
					<div className={styles.gamelogControls}>
						{scheduleLoading || !seasons ? (
							<span className={styles.loadingText}>Loading...</span>
						) : (
							<>
								<div className={styles.gamelogSeasonSelect}>
									<RightControls
										seasons={seasons}
										selectedSeason={selectedSeason}
										onSeasonChange={setSelectedSeason}
										compact
									/>
								</div>
								<CompetitionList
									competitions={competitions}
									selectedCompetitions={selectedCompetitions}
									toggleCompetition={toggleCompetition}
								/>
							</>
						)}
					</div>
					<div className={styles.gamelogScrollArea}>
						{selectedCompetitions.map((slug) => (
							<GamesList key={slug} competitionSlug={slug} />
						))}
						{selectedCompetitions.length === 0 && (
							<div className={styles.emptyState}>
								No competitions selected
							</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value="leaders" className={styles.tabsContent}>
					<TeamLeaders />
				</TabsContent>
			</Tabs>
		</PageContentWrapper>
	);
});

TeamContent.displayName = 'TeamContent';

export default TeamContent;
