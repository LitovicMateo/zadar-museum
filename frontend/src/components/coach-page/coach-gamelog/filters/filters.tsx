import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import SearchBar from '@/components/games-page/games-filter/search-bar';
import Select from 'react-select';
import { selectStyle } from '@/constants/react-select-style';
import styles from './filters.module.css';
import { useCoachSeasonCompetitions } from '@/hooks/queries/coach/useCoachSeasonCompetitions';
import { useCoachSeasons } from '@/hooks/queries/coach/useCoachSeasons';
import { useParams } from 'react-router-dom';

type SeasonOption = { label: string; value: string };

const Filters: React.FC<{
  selectedSeason: string;
  setSelectedSeason: (s: string) => void;
  selectedCompetitions: string[];
  setSelectedCompetitions: (c: string[]) => void;
  setSearchTerm: (s: string) => void;
  searchTerm: string;
}> = ({ selectedSeason, setSelectedSeason, selectedCompetitions, setSelectedCompetitions, setSearchTerm, searchTerm }) => {
  const { coachId } = useParams();
  const { data: competitions } = useCoachSeasonCompetitions(coachId!, selectedSeason);
  const { data: seasons } = useCoachSeasons(coachId!);

  const seasonOptions = (seasons || []).map((s: string) => ({ label: s, value: s }));

  const toggleCompetition = (leagueId: string) => {
    if (selectedCompetitions.includes(leagueId)) {
      setSelectedCompetitions(selectedCompetitions.filter((c) => c !== leagueId));
    } else {
      setSelectedCompetitions([...selectedCompetitions, leagueId]);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.leftRow}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Select<SeasonOption, false>
          placeholder="Season"
          className={styles.selectSmall}
          value={seasonOptions.find((s) => s.value === selectedSeason)}
          options={seasonOptions}
          onChange={(e) => setSelectedSeason(e?.value || '')}
          styles={selectStyle()}
        />
      </div>

      <div className={styles.rightRow}>
        <div className={styles.competitionsRow}>
          {competitions?.map((c: any) => (
            <CompetitionSelectItem key={c.league_id} leagueId={c.league_id} leagueName={c.league_name} onCompetitionChange={toggleCompetition} selectedCompetitions={selectedCompetitions} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filters;
