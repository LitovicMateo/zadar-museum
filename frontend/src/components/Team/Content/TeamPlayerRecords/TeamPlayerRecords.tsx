import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Select from 'react-select';

import SeasonSelect from '@/components/Games/GamesFilter/SeasonSelect';
import NoContent from '@/components/NoContent/NoContent';
import DynamicContentWrapper from '@/components/UI/DynamicContentWrapper';
import RecordsCard from '@/components/UI/RecordsList/RecordsCard';
import RecordsList from '@/components/UI/RecordsList/RecordsList';
import { selectStyle } from '@/constants/ReactSelectStyle';
import { useTeamPlayerRecords } from '@/hooks/queries/team/UseTeamPlayerRecords';
import { useTeamSeasons } from '@/hooks/queries/team/UseTeamSeasons';

import { playerRecordOptions } from './Options';

import styles from './TeamPlayerRecords.module.css';

type Option = { value: string; label: string };

const TeamPlayerRecords = () => {
	const { teamSlug } = useParams();
	const [statKey, setStatKey] = useState<string>(playerRecordOptions[0].value);
	const [selectedSeason, setSelectedSeason] = useState<string>('');

	const { data: seasons } = useTeamSeasons(teamSlug!);
	const { data: records } = useTeamPlayerRecords(teamSlug!, statKey, selectedSeason);

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
				<RecordsCard>
					<DynamicContentWrapper>
						<RecordsList records={normalized} nameLabel="Player" />
					</DynamicContentWrapper>
				</RecordsCard>
			)}
		</section>
	);
};

export default TeamPlayerRecords;
