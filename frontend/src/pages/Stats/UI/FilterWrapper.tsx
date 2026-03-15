import React from 'react';
import styles from './FilterWrapper.module.css';

const FilterWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return <div className={styles.wrapper}>{children}</div>;
};

export default FilterWrapper;
