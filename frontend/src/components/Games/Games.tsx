import React from 'react';

import GamesFilter from '@/components/Games/GamesFilter/GamesFilter';
import GamesList from '@/components/Games/GamesList/GamesList';
import NoContent from '@/components/NoContent/NoContent';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import PageContentWrapper from '@/components/UI/PageContentWrapper';
import { useGamesContext } from '@/hooks/context/UseGamesContext';

import styles from '@/components/Games/Games.module.css';

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
