import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import RecordsList from '@/components/Venue/Content/VenueRecords/RecordsList';
import NoContent from '@/components/no-content/NoContent';
import DynamicContentWrapper from '@/components/ui/DynamicContentWrapper';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useVenueTeamRecords } from '@/hooks/queries/venue/UseVenueTeamRecords';

import { teamRecordOptions } from './Options';

import styles from './VenueTeamRecords.module.css';

type Option = { value: string; label: string };

const VenueTeamRecords = () => {
	const { venueSlug } = useParams();
	const [statKey, setStatKey] = useState<string>(teamRecordOptions[0].value);

	const { data: records } = useVenueTeamRecords(venueSlug!, statKey);

	const normalized = records?.map((r) => ({
		game_id: r.game_id,
		name: r.opponent_name,
		season: r.season,
		stat_value: Number(r.stat_value)
	}));

	return (
		<section className={styles.section}>
			<Select<Option>
				options={teamRecordOptions as unknown as Option[]}
				value={teamRecordOptions.find((o) => o.value === statKey) as unknown as Option}
				onChange={(opt) => opt && setStatKey(opt.value)}
				isSearchable={false}
				styles={selectStyle('200px')}
				className="text-sm"
			/>
			{!normalized?.length ? (
				<NoContent type="info" description="No records found" />
			) : (
				<DynamicContentWrapper>
					<RecordsList records={normalized} nameLabel="Opponent" />
				</DynamicContentWrapper>
			)}
		</section>
	);
};

export default VenueTeamRecords;
