import React from 'react';
import styles from './ResultContainer.module.css';

type ResultContainerProps = {
	title: string;
	children?: React.ReactNode;
};
const ResultContainer: React.FC<ResultContainerProps> = ({ title, children }) => {
	return (
		<ul>
			<li className={styles.title}>{title}</li>
			{children}
		</ul>
	);
};

export default ResultContainer;
