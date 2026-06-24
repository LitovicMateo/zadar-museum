import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage';
import { useBoxscore } from '@/hooks/context/UseBoxscore';
import { useMainTeam } from '@/hooks/queries/team/UseMainTeam';

import styles from './Menu.module.css';

type MenuProps = {
	showMenu: boolean;
};

const Menu: React.FC<MenuProps> = ({ showMenu }) => {
	const { toggleDatabase } = useBoxscore();
	const { data: mainTeam } = useMainTeam();

	const handleClick = (db: PlayerDB) => {
		toggleDatabase(db);
	};

	if (!showMenu) {
		return null;
	}

	return (
		<div className={styles.wrapper}>
			<div className={styles.inner}>
				<button
					type="button"
					onClick={handleClick.bind(null, 'main')}
					className={`${styles.btn} ${styles.btnMain}`}
				>
					{mainTeam?.short_name ?? mainTeam?.name ?? 'Main'}
				</button>
				<button
					type="button"
					onClick={handleClick.bind(null, 'opponent')}
					className={`${styles.btn} ${styles.btnOpponent}`}
				>
					Opponent
				</button>
			</div>
		</div>
	);
};

export default Menu;
