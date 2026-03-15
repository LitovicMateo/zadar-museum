import React from 'react';
import { cn } from '@/lib/Utils';
import styles from './SidebarWrapper.module.css';

const SidebarWrapper: React.FC<{ children: React.ReactNode; isOpen: boolean }> = ({ children, isOpen }) => {
return (
<aside
aria-expanded={isOpen}
className={cn(styles.aside, isOpen ? styles.open : styles.closed)}
>
<div className={styles.inner}>{children}</div>
</aside>
);
};

export default SidebarWrapper;
