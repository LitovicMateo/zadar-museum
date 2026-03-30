import React from 'react';

import styles from './HeaderWrapper.module.css';

const HeaderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<section className={styles.section}>
			<div className={styles.inner}>{children}</div>
		</section>
	);
};

export default HeaderWrapper;
