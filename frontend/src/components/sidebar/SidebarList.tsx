import React from 'react';
import styles from './SidebarList.module.css';

type SidebarListProps = { children: React.ReactNode };

const SidebarList: React.FC<SidebarListProps> = ({ children }) => {
return <ul className={styles.list}>{children}</ul>;
};

export default SidebarList;
