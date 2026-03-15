import React from 'react';
import Flag from 'react-world-flags';

import { User } from 'lucide-react';

import styles from './PlayerImage.module.css';

type PlayerImage = {
	imageUrl: string;
	name: string;
	nationality?: string | null;
};

const PlayerImage: React.FC<PlayerImage> = ({ imageUrl, name, nationality }) => {
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
			{nationality && <Flag className={styles.flagBadge} code={nationality} aria-label={nationality} />}
		</div>
	);
};

export default PlayerImage;
