import React from 'react';

import { opponentBg, zadarBg } from '@/constants/player-bg';
import { useBoxscore } from '@/hooks/context/useBoxscore';
import { PlayerDB } from '@/pages/Player/Player';

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
		<div className="w-full border-b-1 border-solid border-gray-100 py-2">
			<div className="max-w-[800px] mx-auto flex justify-center items-center gap-6">
				<button
					onClick={handleClick.bind(null, 'zadar')}
					className={`py-1 px-2 min-w-[100px] rounded-md shadow-lg ${zadarBg} text-blue-50`}
				>
					Zadar
				</button>
				<button
					onClick={handleClick.bind(null, 'opponent')}
					className={`py-1 px-2 min-w-[100px] rounded-md shadow-lg ${opponentBg} text-blue-50`}
				>
					Opponent
				</button>
			</div>
		</div>
	);
};

export default Menu;
