import React from 'react';
import { Link } from 'react-router-dom';

import { APP_ROUTES } from '@/constants/Routes';
import { ShieldHalf } from 'lucide-react';
import styles from './TeamName.module.css';

type TeamNameProps = {
	name: string;
	imageUrl: string | undefined;
	slug: string;
};

const TeamName: React.FC<TeamNameProps> = ({ name, imageUrl, slug }) => {
	return (
		<Link to={APP_ROUTES.team(slug)} className={styles.link}>
			<div className={styles.logoBox}>
				{imageUrl ? (
					<img src={imageUrl} alt="" className={styles.logoImg} />
				) : (
					<ShieldHalf size={24} className="text-blue-600" />
				)}
			</div>
			<h2 className={styles.teamTitle}>
				{name}
			</h2>
		</Link>
	);
};

export default TeamName;
