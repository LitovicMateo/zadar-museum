import { useState } from 'react';
import { useParams } from 'react-router-dom';
import AppSelect from '@/components/forms/shared/AppSelect';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import { Avatar } from '@/components/UI/Avatar';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import { Podium } from '@/components/UI/Podium';
import RecordsCard from '@/components/UI/RecordsList/RecordsCard';
import RecordsList from '@/components/UI/RecordsList/RecordsList';
import { APP_ROUTES } from '@/constants/Routes';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useVenuePlayerRecords } from '@/hooks/queries/venue/UseVenuePlayerRecords';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';

import { playerRecordOptions } from './Options';

type Option = { value: string; label: string };

const VenuePlayerRecords = () => {
	const { venueSlug } = useParams();
	const [statKey, setStatKey] = useState<string>(playerRecordOptions[0].value);
	const [selectedSeason, setSelectedSeason] = useState<string>('');

	const { data: seasons } = useVenueSeasons(venueSlug!);
	const { data: records } = useVenuePlayerRecords(venueSlug!, statKey, selectedSeason);

	const normalized = records?.map((r) => ({
		game_id: r.game_id,
		name: `${r.first_name} ${r.last_name}`,
		season: r.season,
		stat_value: Number(r.stat_value),
		image_url: r.image_url
	}));

	const top3 = normalized?.slice(0, 3) ?? [];
	const rest = normalized?.slice(3) ?? [];

	return (
		<section className="space-y-4">
			<div className="flex flex-wrap items-center gap-3">
				<AppSelect<Option>
					options={playerRecordOptions as unknown as Option[]}
					value={playerRecordOptions.find((o) => o.value === statKey) as unknown as Option}
					onChange={(opt) => opt && setStatKey(opt.value)}
					isSearchable={false}
					styles={selectStyle('200px')}
					className="text-sm"
				/>
				<SeasonSelect
					compact
					showAll
					seasons={seasons ?? []}
					selectedSeason={selectedSeason}
					onSeasonChange={setSelectedSeason}
				/>
			</div>
			{!normalized?.length ? (
				<NoContent type="info" description="No records found" />
			) : (
				<div className="space-y-4">
					<Podium
						items={top3.map((r) => ({
							id: `${r.game_id}-${r.name}`,
							name: r.name,
							to: APP_ROUTES.game(r.game_id),
							value: r.stat_value,
							meta: r.season,
							avatar: <Avatar src={r.image_url} alt={r.name} className="h-full w-full" />
						}))}
						eyebrow="All-time record"
						ariaLabel="Top player records"
					/>
					{rest.length > 0 && (
						<RecordsCard>
							<DynamicContentWrapper>
								<RecordsList
									records={rest.map((r) => ({
										...r,
										avatar: <Avatar src={r.image_url} alt={r.name} className="h-full w-full" />
									}))}
									nameLabel="Player"
									startRank={4}
									showHeader={false}
								/>
							</DynamicContentWrapper>
						</RecordsCard>
					)}
				</div>
			)}
		</section>
	);
};

export default VenuePlayerRecords;
