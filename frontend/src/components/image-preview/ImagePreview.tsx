import React from 'react';

import { X } from 'lucide-react';
import styles from '@/components/image-preview/ImagePreview.module.css';

type ImagePreviewProps = {
	preview: string;
	removeImage: () => void;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({ preview, removeImage }) => {
	return (
		<div className={styles.wrapper}>
			<button
				type="button"
				onClick={removeImage}
				className={styles.remove}
			>
				<X size={14} />
			</button>
			<img src={preview} alt="Preview" className={styles.img} />
		</div>
	);
};

export default ImagePreview;
