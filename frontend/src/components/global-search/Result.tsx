import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Result.module.css';

type ResultProps = {
	item: string;
	url: string;
	clearSearch: () => void;
};

const Result: React.FC<ResultProps> = ({ item, url, clearSearch }) => {
	return (
		<li className={styles.item}>
			<Link to={url} onClick={clearSearch}>
				{item}
			</Link>
		</li>
	);
};

export default Result;
