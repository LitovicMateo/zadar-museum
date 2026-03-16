import React from 'react';
import Flag from 'react-world-flags';

import styles from './ProfileImage.module.css';

type ProfileImageProps = {
	imageUrl: string | null | undefined;
	name: string;
	nationality?: string | null;
};

const PersonPlaceholder: React.FC = () => (
	<svg
		viewBox="0 0 100 100"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		width="120"
		height="120"
		aria-hidden="true"
	>
		{/* Head */}
		<circle cx="50" cy="35" r="18" fill="rgba(255,255,255,0.25)" stroke="#fff" strokeWidth="2" />
		{/* Shoulders / body silhouette */}
		<path
			d="M10 95 C10 68 25 58 50 58 C75 58 90 68 90 95"
			fill="rgba(255,255,255,0.25)"
			stroke="#fff"
			strokeWidth="2"
			strokeLinecap="round"
		/>
	</svg>
);

const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, name, nationality }) => {
	const showPlaceholder = !imageUrl || imageUrl.includes('undefined');

	return (
		<div className={styles.wrapper}>
			<div className={styles.clipArea}>
				{showPlaceholder ? (
					<div className={styles.imageFrame}>
						<PersonPlaceholder />
					</div>
				) : (
					<img src={imageUrl} alt={name} className={styles.img} />
				)}
			</div>
			{nationality && <Flag className={styles.flagBadge} code={nationality} aria-label={nationality} />}
		</div>
	);
};

export default ProfileImage;
