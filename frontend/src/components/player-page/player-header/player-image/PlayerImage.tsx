import React from 'react';

import { User } from 'lucide-react';

import styles from './PlayerImage.module.css';

type PlayerImage = {
	imageUrl: string;
	name: string;
};

const PlayerImage: React.FC<PlayerImage> = ({ imageUrl, name }) => {
	return (
		<div className={styles.wrapper}>
			{imageUrl.includes('undefined') ? (
				<div className={styles.imageFrame}>
					<User size={180} color="#fff" strokeWidth={1} />
				</div>
			) : (
				<img
					src={imageUrl}
					alt={name}
					className={styles.img}
				/>
			)}
		</div>
	);
};

export default PlayerImage;
