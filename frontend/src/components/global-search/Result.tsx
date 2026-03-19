import React from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/lib/Utils';

import styles from './Result.module.css';

type ResultProps = {
	item: string;
	url: string;
	clearSearch: () => void;
	isActive?: boolean;
};

const Result: React.FC<ResultProps> = ({ item, url, clearSearch, isActive = false }) => {
	return (
		<li className={cn(styles.item, isActive && styles.itemActive)}>
			<Link to={url} onClick={clearSearch}>
				{item}
			</Link>
		</li>
	);
};

export default Result;
