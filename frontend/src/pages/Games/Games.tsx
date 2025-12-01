import React from 'react';

import GamesFilter from '@/components/games-page/games-filter/games-filter';
import GamesList from '@/components/games-page/games-list/games-list';
import NoContent from '@/components/no-content/no-content';
import PageContentWrapper from '@/components/ui/page-content-wrapper';
import { useGamesContext } from '@/hooks/context/useGamesContext';

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
			<div className="w-full flex flex-col gap-4 overflow-y-auto min-h-svh">
				<GamesFilter />
				{selectedCompetitions.map((slug) => (
					<GamesList key={slug} competitionSlug={slug} />
				))}
			</div>
		</PageContentWrapper>
	);
};

export default GamesContent;
