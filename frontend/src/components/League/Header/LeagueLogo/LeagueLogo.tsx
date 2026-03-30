import React from 'react';

import { User } from 'lucide-react';

import styles from './LeagueLogo.module.css';

type LeagueLogoProps = {
	imageUrl: string;
	name: string;
};

const LeagueLogo: React.FC<LeagueLogoProps> = ({ imageUrl, name }) => {
	return (
		<div className={styles.wrapper}>
			<div className={styles.clipArea}>
				{imageUrl.includes('undefined') ? (
					<div className={styles.imageFrame}>
						<User size={180} color="#fff" strokeWidth={1} />
					</div>
				) : (
					<img src={imageUrl} alt={name} className={styles.img} />
				)}
			</div>
		</div>
	);
};

export default LeagueLogo;
