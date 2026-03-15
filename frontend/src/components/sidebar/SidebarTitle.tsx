import React from 'react';
import styles from './SidebarTitle.module.css';

const SidebarTitle: React.FC<{ title: string }> = ({ title }) => {
return (
<div className={styles.wrapper}>
<div className={styles.top}>
<div className={styles.icon}>
<span className={styles.iconText}>{title.charAt(0)}</span>
</div>
<div>
<h2 className={styles.title}>{title}</h2>
<div className={styles.subtitle}>Admin Panel</div>
</div>
</div>
</div>
);
};

export default SidebarTitle;
