import React from 'react';
import { cn } from '@/lib/Utils';
import styles from './PageContentWrapper.module.css';

const PageContentWrapper: React.FC<{ children: React.ReactNode; width?: string; fillHeight?: boolean }> = ({ children, width, fillHeight }) => {
	return (
		<section
			className={cn(styles.wrapper, fillHeight && styles.fillHeight)}
			style={{ maxWidth: width }}
		>
			{children}
		</section>
	);
};

export default PageContentWrapper;
