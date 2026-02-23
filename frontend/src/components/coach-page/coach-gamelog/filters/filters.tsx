import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import CompetitionSelectItem from '@/components/games-page/games-filter/competition-select';
import SearchBar from '@/components/games-page/games-filter/search-bar';
import { useCoachSeasonCompetitions } from '@/hooks/queries/coach/useCoachSeasonCompetitions';
import styles from './filters.module.css';

type Competition = {
  league_id: string;
  league_name: string;
  competition_slug: string;
};

const Filters: React.FC<{
  selectedSeason: string;
  selectedCompetitions: string[];
  setSelectedCompetitions: (c: string[]) => void;
  setSearchTerm: (s: string) => void;
  searchTerm: string;
}> = ({ selectedSeason, selectedCompetitions, setSelectedCompetitions, setSearchTerm, searchTerm }) => {
  const { coachId } = useParams();
  const { data: competitions } = useCoachSeasonCompetitions(coachId!, selectedSeason);

  const uniqueCompetitions = useMemo(() => {
    if (!competitions) return [];
    const seen = new Set<string>();
    return competitions.filter((c: Competition) => {
      const id = String(c.league_id);
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }, [competitions]);

  const toggleCompetition = (leagueId: string) => {
    if (selectedCompetitions.includes(leagueId)) {
      setSelectedCompetitions(selectedCompetitions.filter((c) => c !== leagueId));
    } else {
      setSelectedCompetitions([...selectedCompetitions, leagueId]);
    }
  };

  return (
    <div className={styles.root}>
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className={styles.competitionsRow}>
        {uniqueCompetitions.map((c: Competition) => (
          <CompetitionSelectItem
            key={String(c.league_id)}
            leagueId={String(c.league_id)}
            leagueName={c.league_name}
            onCompetitionChange={toggleCompetition}
            selectedCompetitions={selectedCompetitions}
          />
        ))}
      </div>
    </div>
  );
};

export default Filters;
