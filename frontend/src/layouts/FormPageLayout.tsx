import React from 'react';

import styles from './FormPageLayout.module.css';

const FormPageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <main className={styles.layout}>{children}</main>;
};

export default FormPageLayout;
