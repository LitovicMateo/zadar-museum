import React from 'react';

import { User } from 'lucide-react';
import styles from './coach-image.module.css';

type CoachImage = {
	imageUrl: string;
	name: string;
};

const CoachImage: React.FC<CoachImage> = ({ imageUrl, name }) => {
	return (
		<div className={styles.wrapper}>
			{imageUrl.includes('undefined') ? (
				<div className={styles.placeholder}>
					<User size={180} color="#fff" strokeWidth={1} />
				</div>
			) : (
				<img src={imageUrl} alt={name} className={styles.image} />
			)}
		</div>
	);
};

export default CoachImage;
