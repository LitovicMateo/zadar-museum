import React from 'react';
import { Info, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/Utils';
import styles from './NoContent.module.css';

type NoContentType = 'success' | 'error' | 'info';

type Props = {
	type: NoContentType;
	title?: string;
	description?: React.ReactNode;
};

const iconByType = (type: NoContentType) => {
	switch (type) {
		case 'success':
			return <CheckCircle className={styles.iconSuccess} />;
		case 'error':
			return <XCircle className={styles.iconError} />;
		case 'info':
		default:
			return <Info className={styles.iconInfo} />;
	}
};

const typeClass: Record<NoContentType, string> = {
	success: styles.success,
	error: styles.error,
	info: styles.info,
};

const NoContent: React.FC<Props> = ({ type, title, description }) => {
	if ((title === undefined || title === '') && (description === undefined || description === '')) {
		throw new Error('NoContent requires at least a `title` or a `description`.');
	}

	return (
		<div className={styles.wrapper}>
			<div className={cn(styles.content, typeClass[type], title ? styles.alignStart : styles.alignCenter)}>
				<div className={title ? styles.iconTop : styles.iconWrapper}>{iconByType(type)}</div>
				<div className={styles.textWrapper}>
					{title ? <div className={styles.textTitle}>{title}</div> : null}
					{description ? <div>{description}</div> : null}
				</div>
			</div>
		</div>
	);
};

export default NoContent;
