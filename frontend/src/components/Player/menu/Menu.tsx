import React from 'react';

import { PlayerDB } from '@/components/Player/PlayerPage/PlayerPage';
import { useBoxscore } from '@/hooks/context/UseBoxscore';

import styles from './Menu.module.css';

type MenuProps = {
	showMenu: boolean;
};

const Menu: React.FC<MenuProps> = ({ showMenu }) => {
	const { toggleDatabase } = useBoxscore();

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
					onClick={handleClick.bind(null, 'zadar')}
					className={`${styles.btn} ${styles.btnZadar}`}
				>
					Zadar
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
