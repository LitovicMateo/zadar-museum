import React from 'react';
import Flag from 'react-world-flags';

import { User } from 'lucide-react';

import styles from './ProfileImage.module.css';

type ProfileImageProps = {
	imageUrl: string;
	name: string;
	nationality?: string | null;
	fallback?: React.ReactNode;
	variant?: 'logo' | 'profile';
};

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, name, nationality, fallback, variant = 'profile' }) => {
	console.log(imageUrl);

	return (
		<div className={styles.wrapper}>
			<div className={styles.clipArea}>
				{!imageUrl ? (
					<div className={variant === 'logo' ? styles.logoFrame : styles.imageFrame}>
						{fallback ? fallback : <User size={180} color="#fff" strokeWidth={1} />}
					</div>
				) : (
					<div className={variant === 'logo' ? styles.logoFrame : styles.imageFrame}>
						<img src={imageUrl} alt={name} className={styles.img} />
					</div>
				)}
			</div>
			{nationality && <Flag className={styles.flagBadge} code={nationality} aria-label={nationality} />}
		</div>
	);
};

export default ProfileImage;
