import React from 'react';
import styles from '@/components/image-preview/NoImage.module.css';

const NoImage: React.FC = () => {
	return (
		<div className={styles.placeholder}>
			No image selcted
		</div>
	);
};

export default NoImage;
