import React from 'react';
import { useParams } from 'react-router-dom';

import { useBoxscore } from '@/hooks/context/useBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/useAllTimeLeagueStats';
import { usePlayerHasAppearances } from '@/utils/playerHasAppearances';

import Buttons from './buttons/buttons';
import MainTable from './main-table/main-table';
import styles from './all-time-league-stats.module.css';

const AllTimeLeagueStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const [view, setView] = React.useState<'total' | 'average'>('total');
	const [location, setLocation] = React.useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const handleViewChange = (view: 'total' | 'average') => {
		setView(view);
	};

	const { data: leagueData } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const hasNeutral = !!(leagueData?.some((d) => (d.total?.neutral?.games ?? 0) > 0));

	React.useEffect(() => {
		if (!hasNeutral && location === 'neutral') setLocation('total');
	}, [hasNeutral, location]);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	return (
		<section className={styles.section}>
			<div className={styles.controls}>
				<Buttons selected={view} setSelected={handleViewChange} />
				<fieldset className={styles.radioGroup}>
					{(['total', 'home', 'away', 'neutral'] as const).map((loc) => (
						<label
							key={loc}
							className={[
								styles.radioLabel,
								loc === 'neutral' && !hasNeutral ? styles.radioLabelDisabled : '',
							].join(' ')}
						>
							<input
								type="radio"
								name="league-stats-location"
								value={loc}
								checked={location === loc}
								onChange={() => setLocation(loc)}
								disabled={loc === 'neutral' && !hasNeutral}
								className={styles.radio}
							/>
							<span>{loc}</span>
						</label>
					))}
				</fieldset>
			</div>
			<MainTable view={view} location={location} />
		</section>
	);
});

AllTimeLeagueStats.displayName = 'AllTimeLeagueStats';

export default AllTimeLeagueStats;
