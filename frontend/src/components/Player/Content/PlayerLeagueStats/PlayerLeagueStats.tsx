import React from 'react';
import { useParams } from 'react-router-dom';

import Radio from '@/components/ui/Radio/Radio';
import RadioGroup from '@/components/ui/RadioGroup';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useAllTimeLeagueStats } from '@/hooks/queries/player/UseAllTimeLeagueStats';
import { usePlayerHasAppearances } from '@/utils/PlayerHasAppearances';

import MobileControls from './Controls/MobileControls';
import MainTable from './main-table/MainTable';

import styles from './PlayerLeagueStats.module.css';

const PlayerLeagueStats: React.FC = React.memo(() => {
	const { playerId } = useParams();
	const { selectedDatabase } = useBoxscore();

	const [view, setView] = React.useState<'total' | 'average'>('total');
	const [location, setLocation] = React.useState<'total' | 'home' | 'away' | 'neutral'>('total');

	const handleViewChange = (view: 'total' | 'average') => {
		setView(view);
	};

	const { data: leagueData } = useAllTimeLeagueStats(playerId!, selectedDatabase);
	const hasNeutral = !!leagueData?.some((d) => (d.total?.neutral?.games ?? 0) > 0);

	React.useEffect(() => {
		if (!hasNeutral && location === 'neutral') setLocation('total');
	}, [hasNeutral, location]);

	const hasAppearances = usePlayerHasAppearances(playerId!, selectedDatabase);

	if (!hasAppearances) return null;

	return (
		<section className={styles.section}>
			{/* Mobile: react-select dropdowns */}
			<MobileControls
				hasNeutral={hasNeutral}
				view={view}
				location={location}
				setView={setView}
				setLocation={setLocation}
			/>
			{/* Desktop: original radio controls */}
			<div className={styles.desktopControls}>
				<RadioGroup>
					<Radio label="Total" isActive={view === 'total'} onClick={() => handleViewChange('total')} />
					<Radio label="Average" isActive={view === 'average'} onClick={() => handleViewChange('average')} />
				</RadioGroup>

				<RadioGroup>
					{(['total', 'home', 'away', 'neutral'] as const).map((loc) => (
						<Radio
							label={loc.charAt(0).toUpperCase() + loc.slice(1)}
							isActive={location === loc}
							isDisabled={loc === 'neutral' && !hasNeutral}
							onClick={() => setLocation(loc)}
							key={loc}
						/>
					))}
				</RadioGroup>
			</div>
			<MainTable view={view} location={location} />
		</section>
	);
});

PlayerLeagueStats.displayName = 'PlayerLeagueStats';

export default PlayerLeagueStats;
