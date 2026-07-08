import React from 'react';

import LeaderCard, { LeaderRow } from '@/components/League/Content/LeagueSeasonStats/LeaderCard';
import NoContent from '@/components/NoContent/NoContent';
import { Avatar } from '@/components/UI/Avatar';
import { APP_ROUTES } from '@/constants/Routes';
import { useVenueSeasonPlayerRecords } from '@/hooks/queries/venue/UseVenueSeasonPlayerRecords';

import { playerRecordOptions } from '../VenuePlayerRecords/Options';

type SeasonPlayerRecordsProps = {
	venueSlug: string;
	season: string;
};

const SeasonPlayerRecords: React.FC<SeasonPlayerRecordsProps> = ({ venueSlug, season }) => {
	const { data: records } = useVenueSeasonPlayerRecords(venueSlug, season);

	const total = records
		? playerRecordOptions.reduce((sum, cat) => sum + (records[cat.value]?.length ?? 0), 0)
		: 0;

	return (
		<section className="space-y-4">
			<h2 className="font-display text-lg font-semibold text-court">Player Records</h2>

			{total === 0 ? (
				<NoContent type="info" description="No records found" />
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
					{playerRecordOptions.map((cat) => {
						const rows: LeaderRow[] = (records?.[cat.value] ?? []).map((item) => {
							const name = `${item.first_name} ${item.last_name}`;
							return {
								key: `${item.game_id}-${item.first_name}-${item.last_name}`,
								to: APP_ROUTES.game(item.game_id),
								name,
								value: Number(item.stat_value),
								leading: <Avatar src={item.image_url} alt={name} className="h-full w-full" />
							};
						});
						return <LeaderCard key={cat.value} title={cat.label} rows={rows} />;
					})}
				</div>
			)}
		</section>
	);
};

export default SeasonPlayerRecords;
