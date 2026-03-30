import React from 'react';
import styles from './SidebarContent.module.css';

const SidebarContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
return (
<div id="content" className={styles.content}>
{children}
</div>
);
};

export default SidebarContent;
