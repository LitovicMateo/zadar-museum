import React from 'react';
import { cn } from '@/lib/Utils';
import styles from './SidebarWrapper.module.css';

type SidebarWrapperProps = {
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
};

const SidebarWrapper: React.FC<SidebarWrapperProps> = ({ children, isOpen, className }) => (
  <aside
    aria-expanded={isOpen}
    className={cn(styles.aside, isOpen ? styles.open : styles.closed, className)}
  >
    <div className={styles.inner}>{children}</div>
  </aside>
);

export default SidebarWrapper;
