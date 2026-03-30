import React from 'react';

import GamesFilter from '@/components/games-page/games-filter/GamesFilter';
import GamesList from '@/components/games-page/games-list/GamesList';
import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import PageContentWrapper from '@/components/ui/PageContentWrapper';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from '@/pages/Games/Games.module.css';

const GamesContent: React.FC = () => {
	const { selectedCompetitions, schedule } = useGamesContext();

	if (!schedule) {
		return <NoContent type="info" description={<p>No games in database.</p>} />;
	}

	if (schedule && schedule.length === 0) {
		return <NoContent type="info" description={<p>There are no games in the database.</p>} />;
	}

	return (
		<PageContentWrapper>
			<div className={styles.page}>
				<GamesFilter />
				<DynamicContentWrapper>
					<div className={styles.container}>
						{selectedCompetitions.map((slug) => (
							<GamesList key={slug} competitionSlug={slug} />
						))}
					</div>
				</DynamicContentWrapper>
			</div>
		</PageContentWrapper>
	);
};

export default GamesContent;
