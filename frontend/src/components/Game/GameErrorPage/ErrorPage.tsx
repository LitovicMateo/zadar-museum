import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import styles from './ErrorPage.module.css';

const GameErrorPage: React.FC = () => {
	return (
		<div className={styles.fullHeight}>
			<p>
				No data for this game. Enter{' '}
				<Link to={APP_ROUTES.dashboard.playerStats.create} className="underline">
					stats
				</Link>
				{' here.'}
			</p>
		</div>
	);
};

export default GameErrorPage;
