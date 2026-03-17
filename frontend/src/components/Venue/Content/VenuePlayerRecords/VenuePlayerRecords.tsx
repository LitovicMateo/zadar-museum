import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import RecordsList from '@/components/Venue/Content/VenueRecords/RecordsList';
import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useVenuePlayerRecords } from '@/hooks/queries/venue/UseVenuePlayerRecords';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';

import { playerRecordOptions } from './Options';

import styles from './VenuePlayerRecords.module.css';

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
		stat_value: Number(r.stat_value)
	}));

	return (
		<section className={styles.section}>
			<div className={styles.filters}>
				<Select<Option>
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
				<DynamicContentWrapper>
					<RecordsList records={normalized} nameLabel="Player" />
				</DynamicContentWrapper>
			)}
		</section>
	);
};

export default VenuePlayerRecords;
