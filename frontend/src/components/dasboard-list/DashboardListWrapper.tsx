import React from 'react';
import styles from './DashboardListWrapper.module.css';

const DashboardListWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
return (
<div className={styles.wrapper}>
<div className={styles.card}>
<div className={styles.header}>
<div>
<h2 className={styles.title}>Latest {title}</h2>
<p className={styles.subtitle}>Recently added entries</p>
</div>
</div>
<div className={styles.body}>{children}</div>
</div>
</div>
);
};

export default DashboardListWrapper;
