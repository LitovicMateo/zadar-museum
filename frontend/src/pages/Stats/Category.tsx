import React from 'react';
import styles from './Category.module.css';

const Category: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
	return <div className={styles.category}>{children}</div>;
};

export default Category;
