import React from 'react';
import styles from './Heading.module.css';

type HeadingProps = {
	title: string;
	type?: 'main' | 'secondary';
	id?: string;
};

const Heading: React.FC<HeadingProps> = ({ title, type = 'main', id }) => {
	return (
		<div className={styles.wrapper}>
			<div className={type === 'main' ? styles.barMain : styles.barSecondary} />
			<h2 id={id} className={type === 'main' ? styles.titleMain : styles.titleSecondary}>
				{title}
			</h2>
			{type === 'main' && <div className={styles.line} />}
		</div>
	);
};

export default Heading;
