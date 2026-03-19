import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import SeasonSelect from '@/components/games-page/games-filter/SeasonSelect';
import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import RecordsCard from '@/components/ui/RecordsList/RecordsCard';
import RecordsList from '@/components/ui/RecordsList/RecordsList';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useVenueSeasons } from '@/hooks/queries/venue/UseVenueSeasons';
import { useVenueTeamRecords } from '@/hooks/queries/venue/UseVenueTeamRecords';

import { teamRecordOptions } from './Options';

import styles from './VenueTeamRecords.module.css';

type Option = { value: string; label: string };

const VenueTeamRecords = () => {
	const { venueSlug } = useParams();
	const [statKey, setStatKey] = useState<string>(teamRecordOptions[0].value);
	const [selectedSeason, setSelectedSeason] = useState<string>('');

	const { data: seasons } = useVenueSeasons(venueSlug!);
	const { data: records } = useVenueTeamRecords(venueSlug!, statKey, selectedSeason);

	const normalized = records?.map((r) => ({
		game_id: r.game_id,
		name: r.opponent_name,
		season: r.season,
		stat_value: Number(r.stat_value)
	}));

	return (
		<section className={styles.section}>
			<div className={styles.filters}>
				<Select<Option>
					options={teamRecordOptions as unknown as Option[]}
					value={teamRecordOptions.find((o) => o.value === statKey) as unknown as Option}
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
				<RecordsCard>
					<DynamicContentWrapper>
						<RecordsList records={normalized} nameLabel="Opponent" />
					</DynamicContentWrapper>
				</RecordsCard>
			)}
		</section>
	);
};

export default VenueTeamRecords;
